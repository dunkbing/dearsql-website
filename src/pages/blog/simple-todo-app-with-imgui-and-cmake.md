---
layout: ../../layouts/BlogPostLayout.astro
title: "A simple todo app with Dear ImGui and CMake"
description: "Wire up Dear ImGui, GLFW, and OpenGL with CMake, then build a minimal todo app in about 80 lines of C++."
pubDate: "2026-04-23"
author: "dunkbing"
---

DearSQL's entire UI is built on [Dear ImGui](https://github.com/ocornut/imgui) — no Electron, no web runtime, just a C++ immediate-mode GUI. ImGui has a reputation for being tricky to set up, but that's mostly because it ships as source files rather than a library. Once the CMake is out of the way, writing widgets is a joy.

This post gets you from zero to a working todo app in two files and about 80 lines of code.

## Project layout

```
todo-app/
├── CMakeLists.txt
├── main.cpp
└── external/
    ├── imgui/   (git submodule)
    └── glfw/    (git submodule)
```

Grab the dependencies as submodules:

```bash
git init todo-app && cd todo-app
git submodule add https://github.com/ocornut/imgui external/imgui
git submodule add https://github.com/glfw/glfw external/glfw
```

GLFW handles the window and input. OpenGL is our render backend — it's built into every platform, so no extra library.

## CMakeLists.txt

ImGui is distributed as source. Compile its core files plus the two backends (`imgui_impl_glfw`, `imgui_impl_opengl3`) into a small static library, then link it into the app:

```cmake
cmake_minimum_required(VERSION 3.23)
project(todo-app CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# GLFW — disable docs/tests/examples, we only want the library
set(GLFW_BUILD_DOCS     OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS    OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
add_subdirectory(external/glfw)

# ImGui — compiled as a static library
set(IMGUI_DIR ${CMAKE_SOURCE_DIR}/external/imgui)
add_library(imgui STATIC
    ${IMGUI_DIR}/imgui.cpp
    ${IMGUI_DIR}/imgui_draw.cpp
    ${IMGUI_DIR}/imgui_tables.cpp
    ${IMGUI_DIR}/imgui_widgets.cpp
    ${IMGUI_DIR}/backends/imgui_impl_glfw.cpp
    ${IMGUI_DIR}/backends/imgui_impl_opengl3.cpp
)
target_include_directories(imgui PUBLIC
    ${IMGUI_DIR}
    ${IMGUI_DIR}/backends
)
target_link_libraries(imgui PUBLIC glfw)

# the app
add_executable(todo main.cpp)
target_link_libraries(todo PRIVATE imgui)

if(APPLE)
    target_link_libraries(todo PRIVATE "-framework OpenGL")
elseif(WIN32)
    target_link_libraries(todo PRIVATE opengl32)
else()
    find_package(OpenGL REQUIRED)
    target_link_libraries(todo PRIVATE OpenGL::GL)
endif()
```

Three things worth calling out:

- ImGui lives under `external/imgui`. The `backends/` folder has one pair of files per rendering backend (OpenGL, Metal, DX11, Vulkan, ...). We only compile the two we use.
- GLFW's CMake builds docs and tests by default — turn them off unless you want a 30-second reconfigure.
- OpenGL's linker flag is different on every platform. The `if(APPLE) / WIN32 / else` block handles all three.

## main.cpp

The GLFW + OpenGL3 skeleton is boilerplate — the interesting part is the frame loop in the middle:

```cpp
#include <imgui.h>
#include <imgui_impl_glfw.h>
#include <imgui_impl_opengl3.h>
#include <GLFW/glfw3.h>

#include <string>
#include <vector>

struct Todo {
    std::string text;
    bool        done = false;
};

int main() {
    if (!glfwInit()) return 1;
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 2);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);

    GLFWwindow* win = glfwCreateWindow(500, 600, "Todo", nullptr, nullptr);
    glfwMakeContextCurrent(win);
    glfwSwapInterval(1);  // vsync

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGui::StyleColorsLight();
    ImGui_ImplGlfw_InitForOpenGL(win, true);
    ImGui_ImplOpenGL3_Init("#version 150");

    std::vector<Todo> todos;
    char inputBuf[256] = {};

    while (!glfwWindowShouldClose(win)) {
        glfwPollEvents();
        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();

        // --- UI ---
        const ImGuiViewport* vp = ImGui::GetMainViewport();
        ImGui::SetNextWindowPos(vp->WorkPos);
        ImGui::SetNextWindowSize(vp->WorkSize);
        ImGui::Begin("Todo", nullptr,
            ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoMove |
            ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoCollapse);

        ImGui::SetNextItemWidth(-60);
        bool submit = ImGui::InputText("##new", inputBuf, sizeof(inputBuf),
                                       ImGuiInputTextFlags_EnterReturnsTrue);
        ImGui::SameLine();
        if (ImGui::Button("Add") || submit) {
            if (inputBuf[0] != '\0') {
                todos.push_back({inputBuf, false});
                inputBuf[0] = '\0';
            }
        }
        ImGui::Separator();

        for (size_t i = 0; i < todos.size(); ) {
            ImGui::PushID(static_cast<int>(i));
            ImGui::Checkbox("##done", &todos[i].done);
            ImGui::SameLine();
            if (todos[i].done) ImGui::BeginDisabled();
            ImGui::TextUnformatted(todos[i].text.c_str());
            if (todos[i].done) ImGui::EndDisabled();
            ImGui::SameLine(ImGui::GetWindowWidth() - 40);
            bool remove = ImGui::SmallButton("x");
            ImGui::PopID();
            if (remove) todos.erase(todos.begin() + i);
            else        ++i;
        }

        ImGui::End();
        // --- end UI ---

        ImGui::Render();
        int w, h; glfwGetFramebufferSize(win, &w, &h);
        glViewport(0, 0, w, h);
        glClear(GL_COLOR_BUFFER_BIT);
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
        glfwSwapBuffers(win);
    }

    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplGlfw_Shutdown();
    ImGui::DestroyContext();
    glfwDestroyWindow(win);
    glfwTerminate();
    return 0;
}
```

That's the whole app.

## ImGui patterns worth knowing

A few things in the code above are ImGui idioms rather than obvious:

- `PushID(i)` / `PopID()` around each list item. ImGui identifies widgets by label; without a unique ID, all the checkboxes with label `##done` would share state. Looping over a list? Push the index.
- `##done` is ImGui's convention for "use this label for ID, hide it in the UI". `###foo` means "use this for ID but let the visible label change without breaking state".
- The `for` loop increments `i` *only when we don't erase*. Mutating a container during an ImGui loop is fine — just watch your index.
- `BeginDisabled()` / `EndDisabled()` greys out a widget and blocks input. Don't use it to hide things; it still takes layout space.

## Build and run

```bash
cmake -S . -B build
cmake --build build
./build/todo
```

First build pulls in ImGui and GLFW, so it takes 20-30 seconds. Incremental builds of your app are sub-second — ImGui's headers are heavy but only your `main.cpp` recompiles.

## Where to go next

This app throws away state on exit and has no persistence — fine for a demo, not for actual use. Two small upgrades that make it real:

- Serialize `todos` to JSON on change (see [nlohmann/json](https://github.com/nlohmann/json) — header-only, one CMake `add_subdirectory` away).
- Replace the inline fields with a `docking` branch of ImGui if you want multiple windows. DearSQL uses the docking branch for its tabbed layout.

The ImGui wiki has a long list of [extensions and widgets](https://github.com/ocornut/imgui/wiki/Useful-Extensions) — text editors, node graphs, file dialogs. Most are single-header drop-ins.
