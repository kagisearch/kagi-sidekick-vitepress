<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
// import { useData, withBase } from "vitepress";
// // @ts-ignore
// import Index from "./module/index.js";

// //TODO: delete deprecate code
// const VPData = useData();

// // @ts-ignore
// const locale = VPData.localeIndex || VPData.localePath;

// const metaKey = ref();
// const open = ref<Boolean>(false);
// const searchTerm = ref<string | null>();
// const origin = ref<string>("");
// const input = ref();
// const INDEX_DATA = ref();
// const PREVIEW_LOOKUP = ref();
const Options = ref<Options>();
// const searchIndex = ref();
// const buttonLabel = ref("Search");
// const placeholder = ref("Search docs");

interface Options {
  origin: string;
  previewLength: number;
  buttonLabel: string;
  placeholder: string;
}

// const result = computed(() => {
//   if (searchTerm.value) {
//     var searchResults = searchIndex.value.search(searchTerm.value, {
//       enrich: true,
//     });

//     var search = [] as any[];

//     for (var i = 0; i < searchResults.length; i++) {
//       var id = searchResults[i];
//       var item = PREVIEW_LOOKUP.value[id];

//       var title = item["t"];
//       var preview = item["p"];
//       var link = item["l"];
//       var anchor = item["a"];
//       link = link.split(" ").join("-");
//       search.push({ id: i, link, title, preview, anchor });
//     }
//     return search as any[];
//   }
// });

// const GroupBy = (array: any, func: Function) => {
//   if (!array || !array.length) return [];

//   return array.reduce((acc: any, value: any) => {
//     // Group initialization
//     if (!acc[func(value)]) {
//       acc[func(value)] = [];
//     }

//     // Grouping
//     acc[func(value)].push(value);

//     return acc;
//   }, {});
// };

onMounted(async () => {
  const data = await import("virtual:search-data");
  // INDEX_DATA.value = data.default.INDEX_DATA;
  // PREVIEW_LOOKUP.value = data.default.PREVIEW_LOOKUP;
  Options.value = data.default.Options;
  // origin.value =
  //   window.location.origin +
  //   withBase(locale.value === "root" ? "/" : locale.value);
  // buttonLabel.value = Options.value?.buttonLabel || buttonLabel.value;
  // placeholder.value = Options.value?.placeholder || placeholder.value;

  // var document = new Index(Options.value);

  // document.import("reg", INDEX_DATA.value.reg);
  // document.import("cfg", INDEX_DATA.value.cfg);
  // document.import("map", INDEX_DATA.value.map);
  // document.import("ctx", INDEX_DATA.value.ctx);

  // searchIndex.value = document;

  // metaKey.value.innerHTML = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
  //   ? "⌘"
  //   : "Ctrl";

  // const handleSearchHotKey = (e: KeyboardEvent) => {
  //   if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
  //     e.preventDefault();
  //     openSearch();
  //   }
  //   if (e.key === "Escape") {
  //     if (searchTerm.value?.length == 0 && open.value) open.value = false;
  //   }
  // };

  // window.addEventListener("keydown", handleSearchHotKey);
});

const searchOpen = ref<boolean>(false);
const chatOpen = ref<boolean>(false);
const chatMinimized = ref<boolean>(false);

// Add listener to root HTML element to see if the page is dark mode
onMounted(async () => {
  setInterval(() => {
    // @ts-ignore
    document
      .getElementById("sidekick-search-iframe")
      // @ts-ignore
      .contentWindow.postMessage(
        {
          type: "sidekick-url",
          value: window.location.href,
        },
        "*"
      );
  }, 1000);

  function updateDarkMode() {
    const darkMode = document.documentElement.classList.contains("dark");
    if (darkMode) {
      // @ts-ignore
      document
        .getElementById("sidekick-search-iframe")
        // @ts-ignore
        .contentWindow.postMessage(
          {
            type: "darkMode",
            value: true,
          },
          "*"
        );
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
        .getElementById("sidekick-search-iframe")
        // @ts-ignore
        .contentWindow.postMessage(
          {
            type: "darkMode",
            value: false,
          },
          "*"
        );
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

  // also run on iframe load
  const iframe = document.getElementById("sidekick-search-iframe");
  iframe?.addEventListener("load", updateDarkMode);
  iframe?.addEventListener("load", () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const searchString = urlParams.get("q") || urlParams.get("search");

    if (searchString) {
      // @ts-ignore
      document
        .getElementById("sidekick-search-iframe")
        // @ts-ignore
        .contentWindow.postMessage(
          {
            type: "sidekick-search-query",
            value: searchString,
          },
          "*"
        );
    }
  });

  const chatIframe = document.getElementById("sidekick-chat-iframe");
  chatIframe?.addEventListener("load", updateDarkMode);

  window.addEventListener("message", (event) => {
    console.log("message", event.data);
    if (event.data.type === "sidekick-search-open" && iframe) {
      if (event.data.value) {
        iframe?.classList.add("sidekick-search-active");
        // iframe.style.height = "60vh";
        // open.value = true;
      } else {
        iframe?.classList.remove("sidekick-search-active");
        // iframe.style.height = "3rem";
        // open.value = false;
      }
    }

    if (event.data.type === "sidekick-search-close") {
      searchOpen.value = false;
    }

    if (event.data.type === "sidekick-chat-open") {
      chatOpen.value = !!event.data.value;
      chatMinimized.value = false;
    }

    if (event.data.type === "sidekick-chat-minimize") {
      chatMinimized.value = true;
    }
  });

  function handleSearchHotKey(e: KeyboardEvent) {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      console.log("open search hotkey");
      e.preventDefault();
      // focus iframe
      // @ts-ignore
      document.getElementById("sidekick-search-iframe").contentWindow.focus();
      searchOpen.value = true;

      // @ts-ignore
      document
        .getElementById("sidekick-search-iframe")
        // @ts-ignore
        .contentWindow.postMessage(
          {
            type: "sidekick-focus",
          },
          "*"
        );
    }
    if (e.key === "Escape") {
      searchOpen.value = false;
    }
  }

  window.addEventListener("keydown", handleSearchHotKey);
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
    <iframe
      id="sidekick-search-iframe"
      class="sidekick-search-iframe"
      :class="{ 'sidekick-search-open': searchOpen }"
      :src="Options?.origin"
      frameborder="0"
      allowtransparency="true"
    ></iframe>
    <iframe
      :src="Options?.origin + '/chat.html'"
      id="sidekick-chat-iframe"
      class="sidekick-chat-iframe"
      :class="{
        'sidekick-chat-open': chatOpen,
        'sidekick-chat-minimized': chatMinimized,
      }"
      frameborder="0"
      allowtransparency="true"
      allow="*"
      style="
        /* background: transparent;
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 100;
        height: 60vh;
        width: 24rem; */
      "
    ></iframe>
    <!-- </div> -->
  </div>
</template>

<style>
.VPNavBarSearch {
  flex-grow: 1;
  position: relative;
}

#sidekick-container {
  /* position: relative;
  flex-grow: 1;
  margin-top: -1.2rem;
  margin-left: 3rem;
  margin-right: 1rem; */
}

#sidekick-search-button {
  display: none;
}

.sidekick-search-iframe {
  background: transparent;
  position: absolute;
  /* padding-top: 0.7rem; */
  padding-left: 3rem;
  padding-right: 2rem;
  top: -1.2rem;
  /* left: 3rem;
  right: 2rem; */
  height: 4rem;
  width: 100%;
  z-index: 100;
  color-scheme: light;
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
\
