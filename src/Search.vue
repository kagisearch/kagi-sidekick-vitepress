<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
const Options = ref<Options>();

interface Options {
  origin: string;
  previewLength: number;
  buttonLabel: string;
  placeholder: string;
}

onMounted(async () => {
  const data = await import("virtual:search-data");
  Options.value = data.default.Options;
});

const searchOpen = ref<boolean>(false);
const chatOpen = ref<boolean>(false);
const chatMinimized = ref<boolean>(false);

// Add listener to root HTML element to see if the page is dark mode
onMounted(async () => {
  function updateDarkMode() {
    const darkMode = document.documentElement.classList.contains("dark");
    if (darkMode) {
      // @ts-ignore
      document
        .getElementById("sidekick-chat-iframe")
        // @ts-ignore
        .contentWindow.postMessage(
          {
            type: "darkMode",
            value: true,
          },
          "*"
        );
    } else {
      // @ts-ignore
      document
        .getElementById("sidekick-chat-iframe")
        // @ts-ignore
        .contentWindow.postMessage(
          {
            type: "darkMode",
            value: false,
          },
          "*"
        );
    }
  }

  const observer = new MutationObserver(updateDarkMode);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });


  const chatIframe = document.getElementById("sidekick-chat-iframe");
  chatIframe?.addEventListener("load", updateDarkMode);

  window.addEventListener("message", (event) => {
    console.log("message", event.data);


    if (event.data.type === "sidekick-chat-open") {
      chatOpen.value = !!event.data.value;
      chatMinimized.value = false;
    }

    if (event.data.type === "sidekick-chat-minimize") {
      chatMinimized.value = true;
    }
  });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const searchString = urlParams.get("q") || urlParams.get("search");

  if (searchString) {
    openSearch();
  }

  // @ts-ignore
  import("https://sidekick-ui-next.kagi.com/component.js")
});

// on open change, console log the value
watch(searchOpen, (value) => {
  console.log("open", value);
});

function openSearch() {
  searchOpen.value = true;
}

function closeSearch() {
  searchOpen.value = false;
}
</script>

<template>
  <div class="VPNavBarSearch">
    <button id="sidekick-search-button" @click="openSearch">
      <svg width="20" height="20" id="sidekick-search-icon" viewBox="0 0 20 20">
        <path
          d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
          stroke="currentColor"
          fill="none"
          fill-rule="evenodd"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </button>
    <!-- <div id="sidekick-container"> -->
    <!-- <iframe
      id="sidekick-search-iframe"
      class="sidekick-search-iframe"
      :class="{ 'sidekick-search-open': searchOpen }"
      :src="Options?.origin"
      frameborder="0"
      allowtransparency="true"
    ></iframe> -->
    <!-- <script src="/src/component.ts" type="module"></script> -->
  <!-- </head>

  <body> -->
      <sidekick-search 
      id="sidekick-search-iframe"
        class="sidekick-search-iframe"
        :class="{ 'sidekick-search-open': searchOpen }"
        :origin="Options?.origin"
        @click="closeSearch"
        ></sidekick-search>
    <iframe
      src="https://sidekick-ui-next.kagi.com/chat.html"
      id="sidekick-chat-iframe"
      class="sidekick-chat-iframe"
      :class="{
        'sidekick-chat-open': chatOpen,
        'sidekick-chat-minimized': chatMinimized,
      }"
      frameborder="0"
      allowtransparency="true"
      allow="*"
    ></iframe>
    <!-- </div> -->
  </div>
</template>

<style>
.VPNavBarSearch {
  flex-grow: 1;
  position: relative;
}

#sidekick-search-button {
  display: none;
}

.sidekick-search-iframe {
  background: transparent;
  position: absolute;
  /* padding-top: 0.7rem; */
  /* padding-left: 3rem;
  padding-right: 2rem; */
  top: -1.2rem;
  /* left: 3rem;
  right: 2rem; */
  height: 4rem;
  /* width: 100%; */
  z-index: 100;
  color-scheme: light;
  left: min(7rem, 12%);
  right: 1rem;
}

.sidekick-chat-iframe {
  background: transparent;
  display: none;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  height: 60vh;
  width: 24rem;
}

.sidekick-chat-open {
  display: block;
}

.sidekick-search-active {
  height: 60vh;
}

.sidekick-chat-minimized {
  height: 7rem;
  width: 7rem;
}

@media (max-width: 960px) {
  .VPNavBarSearch {
    flex-grow: 0;
  }

  .sidekick-chat-iframe {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
  }

  .sidekick-search-iframe {
    display: none;
  }

  #sidekick-search-button {
    display: block;
  }

  .sidekick-search-open {
    position: fixed;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 2rem;
    height: 100vh;
    /* glassy (slightly gray blur) */
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
