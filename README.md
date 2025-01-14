# Fridge Poetry

Second go.

-   UI framework wraps entire frontend, not just specific parts. Embed the 'fridge' as a component.
-   MongoDB for database. (Or open-source alternative? Or Postgres?)
-   Vite for bundler/buidler
-   Just Svelte (not SvelteKit) I think. Don't really need SSR because there's really just the one 'page' and it's very dynamic and doesn't need SEO.
-   Fridge and user management menu can actually be outside of the fridge, accessed from the 'Fridge poetry. Welcome' page. Doesn't need to be on the fridge itself.
-   Add 'and' !

## MVP Features

-   Can drag+drop magnets and record their positions. Can retrieve magnets' positions and display them.
-   Can create account. Can change your display name. Can log in and out. Can view their fridges.
-   Can create fridges. Can invite people to a fridge. Can accept invitations.
-   Invited users have different permissions than owners.
-   Users are invited by email. If that email is not a registered account, there is a flow for the user to sign up and join the fridge at the same time.
-   Can change word list. This necessarily removes removed words from the fridge, and randomly places new words. Case-insensitive?
-   Users are given a color. This is used for the mode where you can see which words were placed by which people.
-   Can opt-in to email notifications when fridge changes (with cooldown - sends first email right away, waits until sending another)
-   ~~Mobile-friendly interface: MVP features are also available on mobile.~~
    -   ~~Tap a word to select it? Long-hold to drag-and-drop? Pinch and two-finger drag to zoom and scroll?~~
    -   New goal: Technically possible to use on mobile, if frustrating, and keep mobile version in mind when developing.

## Stretch:

-   Mobile-friendly.
-   "poem mode" - select words to save as a 'poem'. The words and their orientation are stored. Has a page to view a fridge's stored poems.
-   Word metrics - how often used in a poem. How often moved?
-   Playback mode - when returning to a fridge after a while, can see which words were moved and from where. The words are colored based on who moved them, and there is a non-interactable ghost where they came from.
-   Invitations can be revoked and declined.
-   Users can add their own words. Permissions about how many custom words each user can add.
-   Can reset account password. Can change account password.
-   "X Users online" display
-   Public fridges w/ guest mode
-   "Remember me" login
-   Word palette of words not currently being used: larger word pool, less cluttered
-   Change display name + color.
-   Fridge selection highlights fridges with changes
-   Archive / delete fridge

Creep:

-   E2E encrypted chat
-   Add pics and postit notes to fridge w/ magnets. Add calendar! From Calendy? Add plugin system so people can create their own widgets - Facebook, weather, todo list, favorite game...

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

## MVP routes

-   /
-   /login
-   /login/accept
-   /fridge/[uid]
-   /manage/[uid]
-   /invitations

## MVP data

### Invitation

```
    {
        id: "invite1",
        fridgeID: "fridge1",
        fromID: "alice",
        toEmail: "bob@test.com",
        toID: "bob", // Populated on Accept. Could also: populate if you can, and if you can't, populate on Accept and add a field like "wasNewSignup" for metrics sakes.
        status: INVITATION_STATUSES.ACCEPTED, // Nuke invite once accepted? Should keep revoked+declined so can't re-invite
    }
```
