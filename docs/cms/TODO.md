This todo is for the Admin CMS only.
~~The site will use `PayloadCMS` for all the functionalities.~~

## TODO

### Development

- [ ] Add feature that allow admin to generate multiple IDs at once.

  - This feature is for Student, Lecturer, and Department.
- [ ] Create a `json` file that contains some of all the possible department ID formats.
- [ ] Preserve form state when the page is reloaded for better UX.
- [ ] Admin create inital passwords for student and lecturer, but when user logged in the first time, the password is required to change on the user interface.
- [X] Add details view page for **Student** and **Lecturer** when clicking on either the displaying content.
- [X] Add delete to 'actions' horizontal dots.

  - [X] Add multiple delete as well.
- [ ] Add more actions to each table (Edit)
- [ ] The delete button in details page doesn't route back to the entity list page.

  - Which means the state is stuck at the detail page, and backend failed to retrieve that entity data because it is already removed from the database.
- [ ] Add a button to copy the entity data to the clipboard.

  - This is for the details page.
- [ ] Add feature that allow user to import csv file to create multiple entities at once.
- [ ] `Recommended Semester/Level` field when admin creating new Course should be number only (use dropdown instead of input because there are only 8 semesters in the university).

### API

- [X] Failed to load entity data, even though the api route is valid

### UI/UX

- [ ] When adding the () => router.push() or router.back(), the `DetailsPage` does redirect to the previous page, but then the page reload once cuz `setTimeout(() => window.location.reload(), 1500);`. But removing the `router`, it will stays on the current `DetailsPage`.
- [ ] The layout shifts happen when the delete dialog confirmation appear.
  - This also happen with the table dropdown.
- [ ] Lecturer with given ID already exist, but the page is still navigate to the lecturer home page after creation, without throwing any error on the form page.
- [ ] After creation, the table doesn't get the updated data (the entity that just created recently)
  - The page needs to reload, in which cause a bad experience to user.
  - Consider adding a `setTimeout` to reload the page after creation.
- [ ] Add an asterisk to indicate that a field is required (for required fields)
- [ ] Column "Full name" is not exist for `admin` table. Need to check the `DataTable` component.
- [ ] Add text wrap (or ... for hiding long text in the description column of tables, especially for the department table)
- [ ] Adjust UI for page: `/admin/management/semester/create`
- [ ] Adjust UI for page: `/admin/management/course-semester/create`
- [ ] Add some graph views for the `View All Management` inside the `AdminDashboard` page.
- [ ] Add courses view for admin to manage the courses.

### Production

- [X] Adjust zod schema for stricter regulations.
- [ ] Uncomment password field in zod schema.
