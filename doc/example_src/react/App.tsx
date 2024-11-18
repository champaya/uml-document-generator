import React, { useState, useEffect, useCallback } from 'react';
import Ticket from './components/Ticket';
import TicketDetailModal from './components/TicketDetailModal';
import DarkModeToggle from './components/DarkModeToggle';
import {
  fetchTickets,
  updateTicketStatus,
  deleteTicket,
  createTicket,
} from './services/api';
import axios from 'axios';

interface TicketData {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

const App: React.FC = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTicket, setNewTicket] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>({
    title: '',
    description: '',
    priority: 'low',
  });
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // チケットをAPIから取得
  useEffect(() => {
    const getTickets = async () => {
      try {
        const data = await fetchTickets();
        setTickets(data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(`エラー: ${err.response.status} ${err.response.statusText}`);
        } else {
          setError('予期せぬエラーが発生しました。');
        }
      } finally {
        setLoading(false);
      }
    };

    getTickets();
  }, []);

  // ステータス変更ハンドラー
  const handleStatusChange = async (
    id: number,
    status: 'todo' | 'in-progress' | 'done'
  ) => {
    try {
      await updateTicketStatus(id, status);
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === id
            ? { ...ticket, status, updatedAt: new Date().toISOString() }
            : ticket
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          `ステータス更新エラー: ${err.response.status} ${err.response.statusText}`
        );
      } else {
        setError('ステータス更新中にエラーが発生しました。');
      }
    }
  };

  // チケット削除ハンドラー
  const handleDelete = async (id: number) => {
    try {
      await deleteTicket(id);
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== id)
      );
    } catch (err) {
      setError('チケット削除中にエラーが発生しました。');
    }
  };

  // チケット作成ハンドラー
  const handleCreate = async () => {
    if (!newTicket.title || !newTicket.description) {
      setError('タイトルと説明を入力してください。');
      return;
    }

    try {
      const created = await createTicket(newTicket);
      setTickets((prevTickets) => [created, ...prevTickets]);
      setNewTicket({ title: '', description: '', priority: 'low' });
      setIsCreating(false);
    } catch (err) {
      setError('チケット作成中にエラーが発生しました。');
    }
  };

  // フィルターと検索
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // ダークモード切り替え
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 dark:bg-gray-800 dark:text-white">
        読み込み中...
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto p-4 ${
        isDarkMode ? 'dark:bg-gray-800 dark:text-white' : 'bg-white text-black'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">TODOアプリ</h1>
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* チケット作成フォーム */}
      {isCreating ? (
        <div className="mb-4 p-6 border rounded shadow-lg bg-gray-50 dark:bg-gray-700">
          <h2 className="text-2xl mb-4">新しいチケットを作成</h2>
          <input
            type="text"
            placeholder="タイトル"
            value={newTicket.title}
            onChange={(e) =>
              setNewTicket({ ...newTicket, title: e.target.value })
            }
            className="w-full mb-3 p-3 border rounded"
          />
          <textarea
            placeholder="説明"
            value={newTicket.description}
            onChange={(e) =>
              setNewTicket({ ...newTicket, description: e.target.value })
            }
            className="w-full mb-3 p-3 border rounded"
          ></textarea>
          <select
            value={newTicket.priority}
            onChange={(e) =>
              setNewTicket({
                ...newTicket,
                priority: e.target.value as 'low' | 'medium' | 'high',
              })
            }
            className="w-full mb-3 p-3 border rounded"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={handleCreate}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              作成
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="mb-6 bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
        >
          チケット作成
        </button>
      )}

      {/* フィルターと検索 */}
      <div className="mb-6 flex flex-wrap space-x-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-3 border rounded mb-2"
        >
          <option value="all">全てのステータス</option>
          <option value="todo">TODO</option>
          <option value="in-progress">進行中</option>
          <option value="done">完了</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-3 border rounded mb-2"
        >
          <option value="all">全ての優先度</option>
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
        <input
          type="text"
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border rounded mb-2"
        />
      </div>

      {/* チケット一覧 */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <Ticket
              key={ticket.id}
              id={ticket.id}
              title={ticket.title}
              description={ticket.description}
              status={ticket.status}
              priority={ticket.priority}
              createdAt={ticket.createdAt}
              updatedAt={ticket.updatedAt}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onSelect={() => setSelectedTicket(ticket)}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">表示するチケットがありません。</div>
      )}

      {/* チケット詳細モーダル */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default App;