# Fridge Poetry

## Details for quickly catching myself up:

-   There is API documentation (./apidocs/reference). It's a bit out of date.
-   You used an app called Pencil to do a map of the app flow. (./mvp_flow.epgz)
-   You have (most) designs in Figma.
-   There's a bit of a Postman collection going, under your ek@pm account locally. This is more complete.
-   In comments - TODO indicates something to be done. WARNING indicates "planned features and changes may affect this".

D: \00_software\postgres\pgAdmin 4\runtime > psql.exe -d postgres -U postgres

\c fridge_poetry // use this database

\d <table_name> show details about this table

## Intro

Second go.

-   UI framework wraps entire frontend, not just specific parts. Embed the 'fridge' as a component.
-   Postgres for database
-   Vite for bundler/buidler
-   Just Svelte (not SvelteKit) I think. Don't really need SSR because there's really just the one 'page' and it's very dynamic and doesn't need SEO. Vite bundles, svelte-router serves compiled files (? test)
-   Fridge and user management menu can actually be outside of the fridge, accessed from the 'Fridge poetry. Welcome' page. Doesn't need to be on the fridge itself.
-   Add 'and' !
-   Add 'or' !

## MVP Features

-   Can drag+drop magnets and record their positions. Can retrieve magnets' positions and display them.
-   Can create account. Can change your display name. Can log in and out. Can view their fridges.
-   Can change word list on create fridge
-   Can add words to a fridge
-   Can create fridges.
-   Can invite people to a fridge.
-   Can accept invitations.
-   Can revoke invitations.
-   Can remove user from fridge.
-   Owner can delete fridge.
-   Invited users have different permissions than owners.
-   Users are invited by email. If that email is not a registered account, there is a flow for the user to sign up and join the fridge at the same time.
-   Users can choose a color. (This will eventually be used for the mode where you can see which words were placed by which people.)
-   Can opt-in to email notifications when fridge changes (with cooldown - sends first email right away, waits until sending another)
-   ~~Mobile-friendly interface: MVP features are also available on mobile.~~
    -   ~~Tap a word to select it? Long-hold to drag-and-drop? Pinch and two-finger drag to zoom and scroll?~~
    -   New goal: Technically possible to use on mobile, if frustrating, and keep mobile version in mind when developing.
-   Can reset account password. Can change account password.

## Stretch:

-   Mobile-friendly.
-   "poem mode" - select words to save as a 'poem'. The words and their orientation are stored. Has a page to view a fridge's stored poems.
-   Word metrics - how often used in a poem. How often moved?
-   Playback mode - when returning to a fridge after a while, can see which words were moved and from where. The words are colored based on who moved them, and there is a non-interactable ghost where they came from.
-   Invitations can be revoked and declined.
-   Users can add their own words. Permissions about how many custom words each user can add.
-   "X Users online" display
-   Public fridges w/ guest mode
-   "Remember me" login
-   Change email address associated with your account. (Remember that invitations are stored at email address and at user id.)
-   Word palette of words not currently being used: larger word pool, less cluttered
-   Change display name + color.
-   Fridge selection highlights fridges with changes
-   Archive / delete fridge
-   Fridge card is preview of the fridge (build out with known word locations)
-   Fridge card has information about who is currently 'on' the fridge - maybe live updates
-   Can delete words in word-edit mode on fridge
-   Can change word z-index
-   Can change theme of fridge - background, color scheme
-   Different 'word sets' to populate fridge with, in different themes or vibes. Emoji set?
-   Users can add a photo/todo list to the fridge
-   Users can opt-in to sharing hometown so we can add a weather widget (and/or local time widget) showing the time and weather for different users. Cute for friends and families who live far away from each other.

Creep:

-   E2E encrypted chat
-   Add pics and postit notes to fridge w/ magnets. Add calendar! From Calendy? Add plugin system so people can create their own widgets - Facebook, weather, todo list, favorite game...
-   Users can create and share their own word sets

## MVP Required components

-   App
    -   Router (see below) (https://github.com/mefechoel/svelte-navigator ?)
-   User info state
-   Current fridge info state
-   Landing page (/login) - login/signup
    -   Login form
    -   Signup form
-   Welcome page (/) - User and fridge management and portal
    -   Fridges list
-   Fridge settings (/manage/id/[uid])
    -   Fridge invitation list (future: + revoke)
        -   Invite form
    -   Fridge word list
        -   Update word list
    -   Toggle notifications for this fridge
-   My invitations (/invitations)
    -   List: "From [email] to join [fridge] - ACCEPT"
    -   Logic to handle accepting an invitation and routing to that fridge
        -   Accept from email:
            -   Since /invitations will be secured based on is-logged-in, we should link all emails to /login/accept. Then login/accept can check if email exists / check if user is logged in from there.
        -   Accept from this page:
            -   Check if uid matches a current invite uid
            -   If it does, accept and refresh.
-   Accept invitation (/invitation/accept?inviteUid=[uid])
    -   Route not protected
    -   If email already exists and is logged in as that user
        -   Accept invite, redirect to fridge.
    -   If email exists but is logged in as NOT that user
        -   Prompt with do you want to log out to accept this invitation
    -   If email already exists but not logged in
        -   Redirect to /login?inviteUid=[uid]
        -   Populate login with email
        -   Check uid matches one of that user's invites
        -   On successful login, send request (with user id) to join fridge. Finally redirect to fridge.
    -   If email doesn't already exist:
        -   Redirect to /login?inviteUid=[uid]
        -   Populate signup with email
        -   On successful signup response, send request (with user id) to join fridge at uid. Finally redirect to that fridge.
-   Fridge (/fridge/id/[uid])
    -   Words
    -   Mobile controls

## MVP frontend routes

-   /
-   /login
-   /login/accept
-   /login/resetpass
-   /fridge/id/[uid]
-   /fridge/new
-   /manage/id/[uid]
-   /invitations

## MVP backend routes

-   // get invite ids by user
-   // get invite ids by fridge
-   // create invite
-   // accept invite
-   // update word location (streaming?)
-   // get words by fridge id
-   // get user settings for fridge by fridge+user
-   // create user
-   // create fridge
-

## MVP data

### Word list

```
3 the   // number indicates number of word to generate: the the the
and     // no number = 1 copy of word
5       // one number = treat this number as a word. Add one of them
2 5     // two numbers = two copies of '5'

```

## Notes

-   Every user has settings for a fridge in the settings collection. Therefore, to get a list of fridges for a user, or list of users on a fridge, check the settings collection.

## TODO

-   Update OpenAPI docs with changes
-   Capture the following info for the invites table?
    -   Invitations to existing users (ends up being permissions table. Pop over from email invites when signup. Don't forget to check when signup for email in email invites!)
    -   Invitations to email addresses - unexisting users - ends up keyed to 'shadow user' table
    -   Shadow user table - email addresses that are outside of the system
-   Backend testing
-   Frontend - JWT - restricted routing
-   HTTPS
-   Rate limiting for backend (especially anything with emails)
-   Refactor invitation_to_unknown and user_invitation into one table
-   Update error messages so details don't show - for example, "User (# ${userid}) not found" is the error message, and the frontend strips anything within (# ).
-   Move to camelcase id - ie, userId instead of userID. Mostly so toCamel and toSnake work as expected without patching.
