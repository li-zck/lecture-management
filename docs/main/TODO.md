## TODO

### Development

#### Features

- [x] Return to homepage if user try to go back after successfully sign up and the page is redirected to sign in.
  - In this case, the user information is still registered in the database.

  - For example: '401' should return "Invalid username or password, please check again".
  - By now, for every return status, the system still display: 'An internal server error occured. Please contact support.', which is non-sense.
  - [ ] Return predefined error based on status code.

- [x] Add more guards to the authentication flow.
  - This is upgraded by explicitly define function types and interfaces.

- [ ] Adjust token expiry date.
  - Current expiry date is 365 days for development stage only.

- ~[ ] Add refresh token handling.~
  - Could be unnecessary (?)

- [x] Use 'httpOnly cookies' for authorization process instead of 'localStorage'.

- [x] **FIX**: User can navigate back to the previous page, but the url is still 'localhost:3000/signin' or 'localhost:3000/signup', which is a bad UX.
  - Also, this remains a very long cache of routes.

- [x] Add url query param guards since user now can navigate write any '?abcd' to the url and it still work.
  - Actually it doesn't matter.

- [x] Create a dedicated 'Sign out' component, instead of defining it directly in the home page (like in the current development process)

- [x] Add state management: Push to different API routes based on the current form identifiers.
  - For example: User select 'Student' option then the form will push to 'api/auth/student/signin' instead of 'api/auth/lecturer/signin'.

- [x] Create admin dashboard.
  - Already in progress.

- [x] User can view the homepage and the homepage only, even if they are not logged in. This homepage is like a landing page for the site, and it's mostly static.
  - [x] Login and Register button will appear on the top right edge of the screen.
    - [ ] If user is logged in, then the button will change to that user name and profile image (if present), and a sign out button inside that profile dropdown.

- [x] Use `notFound()` from 'next/navigation' for handling not found routes.

- [x] Find a logo for the site.
  - [x] And import that to pages.

- [x] Refactor **all** *imports* and *exports* with `index.ts`.

- [ ] If user try to navigate to `/admin`, they will be redirected to `/`.
  - [ ] Hide the `/admin` route.

- [ ] Remove scroll in auth pages: `/sign-in`, `/sign-up`.
  - Nice to have, not forced to have.

- [x] **URGENT**: logged in user with accessToken, even through `/admin` route still have access to other routes like `/student` and `/lecturer`, which is very concerning, since these route should only be allowed by specific user with correct 'role' in 'accessToken'.
  - Done, middleware updated.

- [x] Adjust site global redirect prevention?: If at `/admin/management/student`, when navigating to ...`/create`, and then go back to `/admin/management/student` and then go back once again, it should navigate to `/admin/management`, instead of looping between `/admin/management/student` and `/admin/management/student/create`.
  - Fixed using the files and folders organization.

- [x] Check alignment of shadcn dropdown component.
  - Issue: Forgot to add *alignment*.

- [x] Implement shadcn Table component for admin management (this is HUGE)
  - [x] Student view page
    - [x] Add row selector

- [x] Considering 'page error UI', not just *toast*.

- [x] Create `useStudents()` hook.

- [x] Create `useLecturer()` hook.

- [x] Create `/admin/management/lecturer` route and page.

- [x] Use full `type` without any `interface` across the whole workspace.

- [ ] Clean whole code tailwindcss styling.

- [ ] Add loading state to components.

- [x] Allow `󰘳 A` in phone number student creation field to select all.

- [ ] Add a `reset filter` button for table inside each **student/lecturer/department** page.

- [ ] Add breadcrumbs for pages.

- [ ] Add dialog component for modals like the more actions inside table.
  - Not urgent.

- [x] Fix routing in each creation page.
  - Use `router.back()` instead of `router.push()` or `router.replace()` for preventing history stack issue.

- [ ] Fix routing in general (**IMPORTANT**).

- [ ] Add create mulitple students at once feature.

- [ ] Add feature that allows admin to upload a `.csv` file and the system will automatically input those data without any manual typing.


#### Fix


#### Styling


#### Routes

##### Redirects

- [ ] all `/sign-up/*` will be redirected to `/sign-up`.
- [ ] all `/sign-in/*` will be redirected to `/sign-in`.


#### Internalization

- [x] en
- [ ] vi


#### URL

##### Signin & Signup

- [x] `/signin?role=lecturer` ✅
- [x] `/signin?role=student` ✅
- [x] `/admin/sign-in` ✅
- [x] `/admin/sign-up` ✅


##### Admin

- [ ] `/admin/management/student`
- [ ] `/admin/management/lecturer`


#### Types

- [x] Add email field for student signin DTO (?)
  - *Remove this since both student and lecturer must login using ID and password only.*


----
### Build and Production

- [ ] Add 'entry points' for Bun to bundle correctly.
- [ ] Generate lists of mock data to show case site features.
- [ ] Update toast messages to be more specific and user-friendly.


----
### Backend reminders

- [ ] Use 'Student ID' and 'Lecturer ID' for signing in instead of email.
- [x] Only **Admin** can create `Student` and `Lecturer` account.
- [ ] Change to 1:1 relation between `departmentHead` and `lecturer`.
