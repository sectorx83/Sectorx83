# D3X8

**Status:** Experimental operating system  
**Category:** Systems / Operating system  
**Repository:** https://github.com/sectorx83/D3X8

D3X8 is an experimental 64-bit x86_64 operating system built from the kernel upward. Its scope spans the boot path, kernel services, hardware discovery, userspace, native applications, networking, storage, and the Harp graphical desktop.

## Why it exists

The project explores what it takes to build a coherent computer system rather than only an application that runs on one. The interesting engineering work happens at the boundaries: how interrupts reach the kernel, how processes receive resources, how drivers expose devices, and how desktop applications share the machine without destabilising it.

## System map

| Layer | Responsibility |
| --- | --- |
| Boot and architecture | Limine boot path and x86_64 entry |
| Kernel | Scheduling, interrupts, memory, system calls and process lifecycle |
| Hardware | ACPI discovery, interrupt controllers, PCI enumeration, USB input, storage and display support |
| Userspace | ELF64 loading, native utilities, terminal and system applications |
| Filesystem and network | VFS, FAT32, TCP/IP, DNS and HTTP downloads |
| Desktop | Harp compositor, shell, widgets and native applications |
| Tooling | Build system and the `zen` package manager |

## Implemented areas

- SMP kernel foundations, preemptive scheduling, ELF64 loading, and system calls.
- ACPI discovery, interrupt controllers, PCI enumeration, USB input, storage, and display support.
- TCP/IP, DNS, HTTP downloads, and package-management experiments.
- VFS and FAT32 support.
- Harp compositor, desktop widgets, terminal, settings, and native applications.

## Engineering priorities

Current work focuses on memory isolation, page-table management, process resource reclamation, graphics stability, concurrent application stability, and broader hardware validation. These are system-level concerns: a desktop that boots is not enough if multiple applications can expose scheduler or lifecycle problems.

## Current boundaries

D3X8 is experimental and is not presented as a production-ready operating system. Hardware coverage depends on implemented drivers, and stability under broad concurrent workloads remains an active area of development.

## Build and contribution

Use the upstream repository as the source of truth for toolchain requirements, build commands, supported emulators, and contribution instructions. Those details can change as the kernel evolves.
