This is a [Next.js](https://nextjs.org) project bootstrapped with [
`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

Every folder under `/app` is a route segment, meaning that `/app/foo/bar` will render the page of the url
`www.example.com/foo/bar`. Under every route segment folder, there should be a `page.tsx` file that will be rendered
when the route is accessed.

`/components` is where all the reusable components are stored. Components that are only used in one page should be
stored in the same folder as the page.

`/lib` is where all the utility functions are stored. This includes functions that interact with the backend, functions
that manipulate data, etc.

`/public` is where all the static files are stored. This includes images, fonts, etc.

`/server` is the server part of the project, built with Node.js, Express, and Prisma. It provides APIs for managing
users, events, donors, comments, and event attendees.

## Backend

#### Work Flow

1. create a new user and assign a role
2. create a new event. Only a coordinator can create an event.
3. create a new eventFundraiser to assign fundraisers to the event.
4. pull donors from Juancho's api and store them in the database. Assign a fundraiser to each donor. (Assuming the donor
   name will always be unique.)
5. create a eventAttendee and assign a donor to an event simultaneously.
6. when a donor donates, update the donor's total donation amount and the event's total donation amount.
7. when attendee list changes, update the eventAttendee table.
8. make a comment on a donor's profile. Only a fundraiser can make a comment.

#### Environment Variables

Create a .env file in the root directory and add the following environment variables:

```
DATABASE_URL=mysql://DB_USER:DB_PASSWORD@dburl:3306/YOUR_DATABASE_NAME
SHADOW_DATABASE_URL=mysql://DB_USER:DB_PASSWORD@dburl:3306/YOUR_SHADOW_DATABASE_NAME
```

#### Database Setup

Apply the migrations to your database:

```
pnpm migrate
```

Generate the Prisma client:

```
pnpm generate
```

#### Running the Server

To start the server, run:

```
pnpm dev
```

which is the same as frontend development server.

To access the api, go to `http://localhost:3000/api/*`. Please refer to the route.ts files in app/api/* folders for the
available routes.

## UI Framework

This project uses shadcn as UI framework. You can find the
documentation [here](https://shadcn.com/docs/getting-started/introduction).

Whenever you need to use a component from shadcn, you can install it by running a command like:

```bash
pnpm dlx shadcn@latest add button
```

You can get the command from the Installation section by choosing `pnpm`.

