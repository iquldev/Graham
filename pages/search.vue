<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_32%),_linear-gradient(180deg,_#090b16_0%,_#100c24_100%)] px-4 py-16 text-slate-100">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-[32px] border border-white/10 bg-slate-950/85 p-10 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
      <div class="space-y-4">
        <h1 class="text-4xl font-semibold text-white">Graham</h1>
        <p class="text-slate-400 max-w-2xl">Enter a query and the AI will return information.</p>
      </div>

      <div class="flex flex-col gap-4">
        <searchInput v-model="searchQuery" @search="handleSearch" />

        <div v-if="isLoading" class="text-violet-300 px-6 py-4 bg-slate-900/80 rounded-3xl">
          Loading...
        </div>

        <template v-else>
          <div
            v-if="quickAnswer"
            class="flex flex-col gap-3 rounded-3xl border border-violet-500/20 bg-violet-950/80 px-6 py-6"
          >
            <p class="text-violet-300 text-sm uppercase tracking-[0.24em]">Quick answer</p>
            <div class="flex flex-col gap-2">
              <h1 class="text-white text-3xl">{{ quickAnswer.title }}</h1>
              <p class="text-slate-400 text-lg leading-8">{{ quickAnswer.info }}</p>
            </div>
          </div>

          <div v-if="sites.length > 0" class="flex flex-col gap-4">
            <div
              v-for="(site, index) in sites"
              :key="index"
              class="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-6"
            >
              <div class="text-xs uppercase tracking-[0.3em] text-violet-300">Information</div>
              <div class="flex flex-col gap-2">
                <h1 class="text-white text-2xl">
                  <a v-if="site.url && site.url !== '#'" :href="site.url" target="_blank" class="hover:text-violet-400 transition-colors">
                    {{ site.title }}
                  </a>
                  <span v-else>{{ site.title }}</span>
                </h1>
                <p class="text-slate-400 text-lg leading-7">{{ site.description }}</p>
                <span v-if="site.source" class="text-xs text-slate-500 italic">Source: {{ site.source }}</span>
              </div>
            </div>
          </div>

          <div
            v-else-if="searchQuery && !isLoading && !quickAnswer"
            class="text-slate-400 px-6 py-4 bg-slate-900/80 rounded-3xl"
          >
            Nothing found or unable to retrieve data
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const searchQuery = ref(route.query.query || "");
const quickAnswer = ref(null);
const sites = ref([]);
const isLoading = ref(false);

const handleSearch = (query) => {
  if (!query) return;
  router.push({ query: { query } });
};

const fetchAll = async (query) => {
  if (!query) return;

  isLoading.value = true;
  try {
    const response = await $fetch("/api/fetchAll", {
      params: { query }
    });

    if (response?.success && response?.data) {
      quickAnswer.value = response.data.quickAnswer || null;
      sites.value = Array.isArray(response.data.sites) ? response.data.sites : [];
    } else {
      quickAnswer.value = null;
      sites.value = [];
    }
  } catch (error) {
    console.error("Fetch error:", error);
    quickAnswer.value = null;
    sites.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => route.query.query,
  (newQuery) => {
    searchQuery.value = newQuery || "";
    if (newQuery) {
      fetchAll(newQuery);
    } else {
      quickAnswer.value = null;
      sites.value = [];
    }
  }
);

onMounted(() => {
  if (searchQuery.value) {
    fetchAll(searchQuery.value);
  }
});
</script>

<style scoped>
* {
  font-family: "IBM Plex Mono", monospace;
}
</style>