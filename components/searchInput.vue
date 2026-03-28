<template>
  <div class="relative w-full">
    <form @submit.prevent="handleSubmit" class="relative">
      <input
        v-model="query"
        type="text"
        class="in h-14 w-full bg-slate-900/90 border border-white/10 rounded-full outline-none px-5 pr-14 placeholder:text-slate-500 text-white shadow-[0_0_0_1px_rgba(148,163,184,0.08)] transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
        placeholder="Enter search query..."
      />
      <button
        type="submit"
        class="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/20 transition hover:scale-105 active:scale-95 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 36 37"
        >
          <path
            d="M33.2 36.5L20.6 23.9C19.6 24.7 18.45 25.3333 17.15 25.8C15.85 26.2667 14.4667 26.5 13 26.5C9.36667 26.5 6.292 25.2413 3.776 22.724C1.26 20.2067 0.00133439 17.132 1.0582e-06 13.5C-0.00133228 9.868 1.25733 6.79333 3.776 4.276C6.29467 1.75867 9.36933 0.5 13 0.5C16.6307 0.5 19.706 1.75867 22.226 4.276C24.746 6.79333 26.004 9.868 26 13.5C26 14.9667 25.7667 16.35 25.3 17.65C24.8333 18.95 24.2 20.1 23.4 21.1L36 33.7L33.2 36.5ZM13 22.5C15.5 22.5 17.6253 21.6253 19.376 19.876C21.1267 18.1267 22.0013 16.0013 22 13.5C21.9987 10.9987 21.124 8.874 19.376 7.126C17.628 5.378 15.5027 4.50267 13 4.5C10.4973 4.49733 8.37267 5.37267 6.626 7.126C4.87933 8.87933 4.004 11.004 4 13.5C3.996 15.996 4.87133 18.1213 6.626 19.876C8.38067 21.6307 10.5053 22.5053 13 22.5Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "search"]);
const router = useRouter();
const query = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  query.value = newVal;
});

const handleSubmit = () => {
  const trimmedQuery = query.value.trim();
  if (trimmedQuery) {
    emit("update:modelValue", trimmedQuery);
    emit("search", trimmedQuery);
    router.push({ path: "/search", query: { query: trimmedQuery } });
  }
};
</script>

<style scoped>
.in {
  font-family: "IBM Plex Mono", monospace;
}
</style>