# Project Overview

This project is a robust task management application, designed to streamline team collaboration and task tracking. Built with Next.js, it offers a user-friendly interface that allows users to efficiently organize their tasks. From creating and managing multiple boards to customizing task cards, the application provides a comprehensive suite of features to enhance productivity and task management

## Key Features

-   **User Authentication**: Secure user authentication implemented using Next Auth.
-   **Boards**: Users can create, update, delete, and manage multiple boards. Each board can have its own visibility settings, cover image, title, and description.
-   **Board Members**: Users can add or remove members to their boards. This feature is only available to the author of the board.
-   **Easy Access to Boards**: A search functionality is available on the navbar for easy access to the boards.
-   **Lists**: Users can create, update, and delete multiple lists within a board. Lists can be rearranged using drag and drop functionality.
-   **Cards**: Each list can contain multiple cards. Each card has its own author and can be rearranged within and across lists. Cards can have a cover image, title, description, attachments, comments, members, and labels with customizable colors and names.
-   **Cover Images**: Users can set a cover image for their boards and cards. They can choose from neutral colors or search for specific images from Unsplash.

## Technologies Used

-   **Next.js**: For building the user interface.

-   **Typescript**: For type-safe development across the application.

-   **TanStack Query**: For efficient fetching, caching, and state
    management.

-   **Prisma**: Utilized for managing database operations.

-   **Tailwind and Shadcn/ui**: Employed for rapid, responsive, and customizable UI design and component development.

-   **Next Auth**: For secure authentication in Next.js applications.

-   **Uploadthing**: File uploads.

## Deployment

The project is ready for deployment on the Vercel Platform, a platform built by the creators of Next.js.

Postgres database hosted on Railway.
