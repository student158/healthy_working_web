<template>
    <nav class="navbar">
        <a class="navbar-brand">
            <img class="mt-1" src="/assets/images/logo.png" width="auto" height="40">
        </a>
        <ul class="nav justify-content-end">
            <li class="nav-item">
                <button class="btn about-btn" title="About this app"><img src="/assets/images/about_icon.png" width="20" height="20"></button>
            </li>
            <!--The "#settings-pane" is in the renderer.js, not clean here-->
            <li class="nav-item">
                <button class="btn settings-btn" data-bs-toggle="modal" data-bs-target="#settings-pane" title="Settings"><img src="/assets/images/settings_icon.png" width="20" height="20"></button>
            </li>
        </ul>
    </nav>
</template>

<script>

export default {
    name: "NavBar",

}
</script>