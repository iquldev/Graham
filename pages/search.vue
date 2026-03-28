<template>
  <div class="flex flex-col px-12 py-8 gap-8">
    <div class="flex flex-col gap-2">
      <searchInput v-model="searchQuery" @search="handleSearch"></searchInput>
      <div
        v-if="isLoading"
        class="text-purple-700 px-6 py-4 bg-black/50 rounded-xl"
      >
        Loading...
      </div>
      <motion.div
        v-else-if="quickAnswer"
        class="flex flex-col gap-2 px-6 py-4 bg-black/50 rounded-xl"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 1, ease: 'easeOut' }"
      >
        <p class="text-purple-700 text-base">Quick answer ✨</p>
        <div class="flex flex-col gap-2">
          <h1 class="text-white text-2xl">{{ quickAnswer.title }}</h1>
          <h2 class="text-zinc-600 text-lg">{{ quickAnswer.info }}</h2>
        </div>
      </motion.div>
      <div
        v-else-if="searchQuery"
        class="text-zinc-600 px-6 py-4 bg-black/50 rounded-xl"
      >
        No quick answer found
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div v-if="sites.length > 0" class="flex flex-col gap-2" v-auto-animate>
        <div
          v-for="site in sites"
          :key="site.url"
          class="flex flex-col gap-2 px-6 py-4 bg-black/50 rounded-xl"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 1, ease: 'easeOut' }"
        >
          <a
            :href="site.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-purple-700 text-base hover:text-purple-500 transition-colors duration-200"
          >
            {{ site.source }}
          </a>
          <div class="flex flex-col gap-2">
            <h1 class="text-white text-2xl">{{ site.title }}</h1>
            <h2 class="text-zinc-600 text-lg">{{ site.description }}</h2>
          </div>
        </div>
      </div>
      <div
        v-else-if="searchQuery && !isLoading"
        class="text-zinc-600 px-6 py-4 bg-black/50 rounded-xl"
      >
        Data not found
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { motion } from "motion-v";

const route = useRoute();
const router = useRouter();

const searchQuery = ref(route.query.query || "");
const quickAnswer = ref(null);
const sites = ref([]);
const isLoading = ref(false);

const handleSearch = async (query) => {
  if (!query) return;
  await fetchAll(query);
};

const fetchAll = async (query) => {
  if (!query) return;

  isLoading.value = true;
  try {
    const response = await $fetch(
      `/api/fetchAll?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
      }
    );

    if (response?.success && response?.data) {
      quickAnswer.value = response.data.quickAnswer || null;
      sites.value = Array.isArray(response.data.sites)
        ? response.data.sites
        : [];
    } else {
      quickAnswer.value = null;
      sites.value = [];
    }
  } catch (error) {
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

watch(searchQuery, (newValue) => {
  if (newValue !== route.query.query) {
    router.replace({
      query: newValue ? { query: newValue } : {},
    });
  }
});

onMounted(() => {
  if (searchQuery.value) {
    fetchAll(searchQuery.value);
  }
});
</script>

<style scoped>
* {
  font-family: "IBM Plex Mono";
}
</style>
