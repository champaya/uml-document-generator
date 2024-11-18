<template>
  <div :class="containerClasses">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">TODOアプリ</h1>
      <DarkModeToggle :isDarkMode="isDarkMode" @toggle="toggleDarkMode" />
    </div>

    <!-- エラーメッセージ -->
    <div v-if="error" class="mb-4 p-2 bg-red-200 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- チケット作成フォーム -->
    <div v-if="isCreating" class="mb-4 p-6 border rounded shadow-lg bg-gray-50 dark:bg-gray-700">
      <h2 class="text-2xl mb-4">新しいチケットを作成</h2>
      <input
        type="text"
        placeholder="タイトル"
        v-model="newTicket.title"
        class="w-full mb-3 p-3 border rounded"
      />
      <textarea
        placeholder="説明"
        v-model="newTicket.description"
        class="w-full mb-3 p-3 border rounded"
      ></textarea>
      <select
        v-model="newTicket.priority"
        class="w-full mb-3 p-3 border rounded"
      >
        <option value="low">低</option>
        <option value="medium">中</option>
        <option value="high">高</option>
      </select>
      <div class="flex space-x-2">
        <button
          @click="handleCreate"
          class="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          作成
        </button>
        <button
          @click="isCreating = false"
          class="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
        >
          キャンセル
        </button>
      </div>
    </div>
    <button
      v-else
      @click="isCreating = true"
      class="mb-6 bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
    >
      チケット作成
    </button>

    <!-- フィルターと検索 -->
    <div class="mb-6 flex flex-wrap space-x-4">
      <select
        v-model="filterStatus"
        class="p-3 border rounded mb-2"
      >
        <option value="all">全てのステータス</option>
        <option value="todo">TODO</option>
        <option value="in-progress">進行中</option>
        <option value="done">完了</option>
      </select>
      <select
        v-model="filterPriority"
        class="p-3 border rounded mb-2"
      >
        <option value="all">全ての優先度</option>
        <option value="low">低</option>
        <option value="medium">中</option>
        <option value="high">高</option>
      </select>
      <input
        type="text"
        placeholder="検索..."
        v-model="searchTerm"
        class="flex-1 p-3 border rounded mb-2"
      />
    </div>

    <!-- チケット一覧 -->
    <div v-if="filteredTickets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Ticket
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        :ticket="ticket"
        @statusChange="handleStatusChange"
        @deleteTicket="handleDelete"
        @selectTicket="setSelectedTicket"
      />
    </div>
    <div v-else class="text-gray-500">表示するチケットがありません。</div>

    <!-- チケット詳細モーダル -->
    <TicketDetailModal
      v-if="selectedTicket"
      :ticket="selectedTicket"
      @close="selectedTicket = null"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import Ticket from './components/Ticket.vue';
import TicketDetailModal from './components/TicketDetailModal.vue';
import DarkModeToggle from './components/DarkModeToggle.vue';
import {
  fetchTickets,
  updateTicketStatus,
  deleteTicket,
  createTicket,
} from './services/api';

interface TicketData {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export default defineComponent({
  name: 'App',
  components: {
    Ticket,
    TicketDetailModal,
    DarkModeToggle,
  },
  setup() {
    const tickets = ref<TicketData[]>([]);
    const loading = ref<boolean>(true);
    const error = ref<string | null>(null);
    const filterStatus = ref<string>('all');
    const filterPriority = ref<string>('all');
    const searchTerm = ref<string>('');
    const isCreating = ref<boolean>(false);
    const newTicket = ref<{
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
    }>({
      title: '',
      description: '',
      priority: 'low',
    });
    const selectedTicket = ref<TicketData | null>(null);
    const isDarkMode = ref<boolean>(false);

    // チケットをAPIから取得
    const getTickets = async () => {
      try {
        const data = await fetchTickets();
        tickets.value = data;
      } catch (err: any) {
        if (err.response) {
          error.value = `エラー: ${err.response.status} ${err.response.statusText}`;
        } else {
          error.value = '予期せぬエラーが発生しました。';
        }
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      getTickets();
    });

    // ステータス変更ハンドラー
    const handleStatusChange = async (id: number, status: 'todo' | 'in-progress' | 'done') => {
      try {
        await updateTicketStatus(id, status);
        const index = tickets.value.findIndex((ticket) => ticket.id === id);
        if (index !== -1) {
          tickets.value[index].status = status;
          tickets.value[index].updatedAt = new Date().toISOString();
        }
      } catch (err: any) {
        if (err.response) {
          error.value = `ステータス更新エラー: ${err.response.status} ${err.response.statusText}`;
        } else {
          error.value = 'ステータス更新中にエラーが発生しました。';
        }
      }
    };

    // チケット削除ハンドラー
    const handleDelete = async (id: number) => {
      try {
        await deleteTicket(id);
        tickets.value = tickets.value.filter((ticket) => ticket.id !== id);
      } catch {
        error.value = 'チケット削除中にエラーが発生しました。';
      }
    };

    // チケット作成ハンドラー
    const handleCreate = async () => {
      if (!newTicket.value.title || !newTicket.value.description) {
        error.value = 'タイトルと説明を入力してください。';
        return;
      }

      try {
        const created = await createTicket(newTicket.value);
        tickets.value.unshift(created);
        newTicket.value = { title: '', description: '', priority: 'low' };
        isCreating.value = false;
      } catch {
        error.value = 'チケット作成中にエラーが発生しました。';
      }
    };

    // フィルターと検索
    const filteredTickets = computed(() => {
      return tickets.value.filter((ticket) => {
        const matchesStatus = filterStatus.value === 'all' || ticket.status === filterStatus.value;
        const matchesPriority =
          filterPriority.value === 'all' || ticket.priority === filterPriority.value;
        const matchesSearch =
          ticket.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.value.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
      });
    });

    // ダークモード切り替え
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    const containerClasses = computed(() =>
      isDarkMode.value
        ? 'container mx-auto p-4 dark:bg-gray-800 dark:text-white'
        : 'container mx-auto p-4 bg-white text-black'
    );

    return {
      tickets,
      loading,
      error,
      filterStatus,
      filterPriority,
      searchTerm,
      isCreating,
      newTicket,
      selectedTicket,
      isDarkMode,
      handleStatusChange,
      handleDelete,
      handleCreate,
      filteredTickets,
      toggleDarkMode,
      containerClasses,
      setSelectedTicket: (ticket: TicketData) => {
        selectedTicket.value = ticket;
      },
    };
  },
});
</script>

<style>
/* グローバルなスタイルやテーマ関連のスタイルをここに記述できます */
</style>