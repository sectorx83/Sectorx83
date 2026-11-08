# D3X8

**Status:** Active development  
**Category:** Systems / Operating system  
**Repository:** https://github.com/sectorx83/D3X8

D3X8 is a 64-bit x86_64 operating system developed primarily in C and assembly. Its scope includes a custom kernel, userspace, device drivers, networking, storage, and the Harp graphical desktop.

## Current engineering areas

- SMP kernel, preemptive scheduling, ELF64 loading, and system calls.
- ACPI discovery, interrupt controllers, PCI enumeration, USB input, storage, and display support.
- TCP/IP, DNS, HTTP downloads, and the `zen` package manager.
- VFS and FAT32 support.
- Harp compositor, desktop widgets, terminal, settings, and native applications.

## Active work

Memory isolation, page-table management, process resource reclamation, graphics stability, and broader hardware validation remain active areas of development. The README describes implemented capabilities and known limitations; it does not claim full POSIX compatibility or universal hardware support.

## Build

See the upstream repository for the current toolchain and build instructions.
