This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies by running:

```bash
pnpm install
````
And run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure
Every folder under `/app` is a route segment, meaning that `/app/foo/bar` will render the page of the url `www.example.com/foo/bar`. Under every route segment folder, there should be a `page.tsx` file that will be rendered when the route is accessed.

`/components` is where all the reusable components are stored. Components that are only used in one page should be stored in the same folder as the page.

`/lib` is where all the utility functions are stored. This includes functions that interact with the backend, functions that manipulate data, etc.

`/public` is where all the static files are stored. This includes images, fonts, etc.

## UI Framework
This project uses shadcn as UI framework. You can find the documentation [here](https://shadcn.com/docs/getting-started/introduction).

Whenever you need to use a component from shadcn, you can install it by running a command like: 
```bash
pnpm dlx shadcn@latest add button
```
You can get the command from the Installation section by choosing `pnpm`.

