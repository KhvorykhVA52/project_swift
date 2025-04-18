<template>
  <div>
    <div class="ideas-container q-pa-md">
      <div class="ideas-header q-mb-md row items-center">
        <h2 class="text-h4 text-weight-bold text-teal-8 q-ma-none">Идеи</h2>
        <q-space />
        <q-input 
          v-model="ideaSearchText"
          outlined
          dense
          placeholder="Поиск идей..."
          class="search-input"
          style="width: 280px"
        >
          <template v-slot:append>
            <q-icon name="search" color="teal" />
          </template>
        </q-input>
        <q-btn 
          color="teal"
          icon="add" 
          label="Предложить идею" 
          @click="addIdea"
          class="q-ml-md"
          unelevated
        />
      </div>

      <div class="ideas-list">
        <q-card 
          v-for="idea in filteredIdeas" 
          :key="idea.id" 
          class="idea-card q-mb-md"
          flat
          bordered
          @click="showIdeaDetails(idea)"
        >
          <q-card-section class="idea-header-section">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6 text-weight-bold">{{ idea.title }}</div>
              </div>
              <div class="col-auto">
                <q-btn-group flat rounded>
                  <q-btn 
                    flat 
                    round 
                    icon="edit" 
                    color="teal-7"
                    @click.stop="editIdea(idea)"
                  />
                  <q-btn 
                    flat 
                    round 
                    icon="delete" 
                    color="red"
                    @click.stop="deleteIdea(idea.id)"
                  />
                  <q-btn 
                    flat 
                    round 
                    icon="transform" 
                    color="positive"
                    @click.stop="convertToProject(idea)"
                  />
                </q-btn-group>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="idea-details">
              <div class="idea-detail-item">
                <div class="idea-label text-teal-7">Проблема</div>
                <div class="idea-value">
                  {{ idea.problem ? truncateText(idea.problem, 150) : '—' }}
                </div>
              </div>
              <div class="idea-detail-item">
                <div class="idea-label text-teal-7">Решение</div>
                <div class="idea-value">
                  {{ idea.solution ? truncateText(idea.solution, 150) : '—' }}
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="idea-meta-section">
            <div class="row items-center justify-between">
              <div class="text-caption text-grey-7">
                <q-icon name="person_outline" size="xs" class="q-mr-xs" />
                {{ idea.author }}
                <q-icon name="event" size="xs" class="q-ml-sm q-mr-xs" />
                {{ idea.date }}
              </div>
              <div class="text-caption text-grey-7">
                <q-icon name="comment" size="xs" class="q-mr-xs" />
                {{ idea.comments.length }} комментариев
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div v-if="filteredIdeas.length === 0" class="text-center q-pa-xl">
          <q-icon name="lightbulb_outline" size="xl" color="grey-5" />
          <div class="text-h6 text-grey-6 q-mt-md">Идей не найдено</div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для добавления/редактирования идеи -->
    <q-dialog v-model="showAddIdeaModal" persistent>
      <q-card style="min-width: 600px">
        <q-card-section class="bg-teal text-white">
          <div class="text-h6">
            {{ editingIdea ? 'Редактировать идею' : 'Добавить новую идею' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-input 
            v-model="currentIdea.title" 
            label="Название *" 
            class="q-mb-md"
            outlined
            color="teal"
            :rules="[val => !!val || 'Обязательное поле']"
            @keydown.enter.prevent="handleIdeaEnter($event)"
          />
          
          <q-input 
            v-model="currentIdea.problem" 
            label="Проблема" 
            type="textarea"
            outlined
            color="teal"
            class="q-mb-md"
            autogrow
            @keydown.enter.prevent="handleIdeaEnter($event)"
          />
          
          <q-input 
            v-model="currentIdea.solution" 
            label="Решение" 
            type="textarea"
            outlined
            color="teal"
            class="q-mb-md"
            autogrow
            @keydown.enter.prevent="handleIdeaEnter($event)"
          />
          
          <q-input 
            v-model="currentIdea.result" 
            label="Ожидаемый результат" 
            type="textarea"
            outlined
            color="teal"
            class="q-mb-md"
            autogrow
            @keydown.enter.prevent="handleIdeaEnter($event)"
          />
          
          <q-input 
            v-model="currentIdea.resources" 
            label="Необходимые ресурсы" 
            type="textarea"
            outlined
            color="teal"
            class="q-mb-md"
            autogrow
            @keydown.enter.prevent="handleIdeaEnter($event)"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 q-pa-md">
          <q-btn flat label="Отмена" color="grey-7" @click="closeModal" />
          <q-btn 
            label="Сохранить" 
            color="teal"
            @click="saveIdea"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Модальное окно для просмотра идеи с комментариями -->
    <q-dialog v-model="showIdeaDetailsModal" full-width>
      <q-card style="min-width: 800px; max-width: 1000px">
        <q-card-section class="bg-teal text-white">
          <div class="text-h6">{{ viewedIdea.title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Проблема</div>
          <div class="q-mb-md">{{ viewedIdea.problem || '—' }}</div>
          
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Решение</div>
          <div class="q-mb-md">{{ viewedIdea.solution || '—' }}</div>
          
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Ожидаемый результат</div>
          <div class="q-mb-md">{{ viewedIdea.result || '—' }}</div>
          
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Необходимые ресурсы</div>
          <div class="q-mb-md">{{ viewedIdea.resources || '—' }}</div>

          <q-separator class="q-my-md" />

          <div class="text-subtitle1 text-weight-medium q-mb-sm">Комментарии</div>
          
          <div 
            v-for="comment in sortedComments(viewedIdea.comments || [])" 
            :key="comment.id" 
            class="comment q-mb-md"
          >
            <div class="comment-bubble">
              <div class="comment-text">
                {{ comment.text }}
              </div>
              <div class="comment-author text-caption text-grey-7 q-mt-xs">
                — {{ comment.author }}, {{ formatCommentDate(comment) }}
              </div>
            </div>
            <div class="comment-actions">
              <q-btn 
                flat 
                dense 
                icon="edit" 
                size="sm" 
                color="teal-7"
                @click.stop="editComment(comment)"
              />
              <q-btn 
                flat 
                dense 
                icon="delete" 
                size="sm" 
                color="red"
                @click.stop="deleteComment(comment.id, viewedIdea.id!)"
              />
            </div>
          </div>

          <div class="add-comment q-mt-md">
            <q-input
              v-model="newComments[viewedIdea.id!]"
              filled
              type="textarea"
              placeholder="Добавить комментарий..."
              autogrow
              class="q-mb-sm comment-textarea"
              @keydown.enter="handleEnter($event, viewedIdea.id!)"
            />
            <q-btn 
              color="teal"
              label="Отправить" 
              @click="addComment(viewedIdea.id!)"
              unelevated
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 q-pa-md">
          <q-btn flat label="Закрыть" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';

interface Comment {
  id: number;
  text: string;
  author: string;
  date: string;
}

interface Idea {
  id: number;
  title: string;
  problem: string;
  solution: string;
  result: string;
  resources: string;
  author: string;
  date: string;
  comments: Comment[];
}

const $q = useQuasar();

// Переменные для функционала идей
const ideas = ref<Idea[]>([
  {
    id: 1,
    title: 'Первая идея',
    problem: 'Описание проблемы',
    solution: 'Предлагаемое решение',
    result: 'Ожидаемый результат',
    resources: 'Необходимые ресурсы',
    author: 'Иван Иванов',
    date: '05.04.2025',
    comments: [
      { id: 1, text: 'Хорошая идея!', author: 'Петр Петров', date: '05.04.2025 10:30' },
      { id: 2, text: 'Нужно доработать', author: 'Сидор Сидоров', date: '05.04.2025 11:45' }
    ]
  },
  {
    id: 2,
    title: 'Вторая идея',
    problem: 'Другая проблема',
    solution: 'Другое решение',
    result: 'Другой результат',
    resources: 'Другие ресурсы',
    author: 'Петр Петров',
    date: '05.04.2025',
    comments: []
  }
]);

const showAddIdeaModal = ref(false);
const showIdeaDetailsModal = ref(false);
const currentIdea = ref<Partial<Idea>>({
  id: null as unknown as number,
  title: '',
  problem: '',
  solution: '',
  result: '',
  resources: '',
  author: 'Иван Иванов',
  date: ''
});
const viewedIdea = ref<Idea>({
  id: 0,
  title: '',
  problem: '',
  solution: '',
  result: '',
  resources: '',
  author: '',
  date: '',
  comments: []
});
const editingIdea = ref(false);
const newComments = ref<Record<number, string>>({});
const ideaSearchText = ref('');

const filteredIdeas = computed(() => {
  if (!ideaSearchText.value) return ideas.value;
  return ideas.value.filter(idea => 
    idea.title.toLowerCase().includes(ideaSearchText.value.toLowerCase()) ||
    idea.problem.toLowerCase().includes(ideaSearchText.value.toLowerCase()) ||
    idea.solution.toLowerCase().includes(ideaSearchText.value.toLowerCase()) ||
    idea.result.toLowerCase().includes(ideaSearchText.value.toLowerCase()) ||
    idea.resources.toLowerCase().includes(ideaSearchText.value.toLowerCase())
  );
});

// Методы для функционала идей
const addIdea = () => {
  currentIdea.value = {
    id: null as unknown as number,
    title: '',
    problem: '',
    solution: '',
    result: '',
    resources: '',
    author: 'Иван Иванов',
    date: ''
  };
  editingIdea.value = false;
  showAddIdeaModal.value = true;
};

const editIdea = (idea: Idea) => {
  currentIdea.value = { ...idea };
  editingIdea.value = true;
  showAddIdeaModal.value = true;
};

const showIdeaDetails = (idea: Idea) => {
  viewedIdea.value = { ...idea };
  showIdeaDetailsModal.value = true;
};

const saveIdea = () => {
  if (editingIdea.value) {
    const index = ideas.value.findIndex(i => i.id === currentIdea.value.id);
    if (index !== -1) {
      ideas.value.splice(index, 1, {
        ...currentIdea.value as Idea,
        comments: ideas.value[index].comments
      });
    }
  } else {
    currentIdea.value.id = ideas.value.length + 1;
    currentIdea.value.date = new Date().toLocaleDateString();
    ideas.value.unshift({
      ...currentIdea.value as Idea,
      comments: []
    });
  }
  showAddIdeaModal.value = false;
};

const closeModal = () => {
  showAddIdeaModal.value = false;
};

const deleteIdea = (id: number) => {
  $q.dialog({
    title: 'Подтверждение',
    message: 'Вы уверены, что хотите удалить эту идею?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    ideas.value = ideas.value.filter(idea => idea.id !== id);
  });
};

const convertToProject = (idea: Idea) => {
  $q.dialog({
    title: 'Преобразовать в проект',
    message: `Вы действительно хотите преобразовать идею "${idea.title}" в проект?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    $q.notify({
      type: 'positive',
      message: `Идея "${idea.title}" преобразована в проект!`
    });
  });
};

const addComment = (ideaId: number) => {
  const idea = ideas.value.find(i => i.id === ideaId);
  if (idea && newComments.value[ideaId] && newComments.value[ideaId].trim() !== '') {
    idea.comments.unshift({
      id: idea.comments.length + 1,
      text: newComments.value[ideaId],
      author: 'Иван Иванов',
      date: new Date().toLocaleString()
    });
    newComments.value[ideaId] = '';
  }
};

const handleEnter = (event: KeyboardEvent, ideaId: number) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = newComments.value[ideaId] || '';
    
    newComments.value[ideaId] = value.substring(0, start) + '\n' + value.substring(end);
    
    // Обновляем позицию курсора
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }, 0);
  }
};

const handleIdeaEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value || '';
    
    textarea.value = value.substring(0, start) + '\n' + value.substring(end);
    
    // Обновляем позицию курсора
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }, 0);
  }
};

const editComment = (comment: Comment) => {
  $q.dialog({
    title: 'Редактировать комментарий',
    prompt: {
      model: comment.text,
      type: 'textarea'
    },
    cancel: true,
    persistent: true
  }).onOk(text => {
    if (text !== null) {
      comment.text = text;
    }
  });
};

const deleteComment = (commentId: number, ideaId: number) => {
  $q.dialog({
    title: 'Подтверждение',
    message: 'Удалить этот комментарий?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    const idea = ideas.value.find(i => i.id === ideaId);
    if (idea) {
      idea.comments = idea.comments.filter(c => c.id !== commentId);
    }
  });
};

const truncateText = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const sortedComments = (comments: Comment[]) => {
  return [...comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const formatCommentDate = (comment: Comment) => {
  return comment.date;
};
</script>

<style scoped>
.ideas-container {
  max-width: 1200px;
  margin: 0 auto;
}

.ideas-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.idea-card {
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.idea-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.idea-header-section {
  padding-bottom: 12px;
}

.idea-meta-section {
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: rgba(0, 150, 136, 0.05);
}

.idea-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.idea-detail-item {
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}

.idea-label {
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--q-teal-7);
}

.idea-value {
  font-size: 0.95rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.comment {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: rgba(0, 150, 136, 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--q-teal-7);
}

.comment-bubble {
  flex-grow: 1;
}

.comment-text {
  font-size: 0.9rem;
  line-height: 1.4;
  word-break: break-word;
  white-space: pre-wrap;
}

.comment-author {
  font-size: 0.75rem;
  margin-top: 4px;
  color: var(--q-grey-7);
}

.comment-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.comment:hover .comment-actions {
  opacity: 1;
}

.add-comment {
  border-top: 1px dashed rgba(0, 0, 0, 0.12);
  padding-top: 16px;
}

.search-input {
  border-radius: 20px;
}

.comment-textarea {
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 600px) {
  .ideas-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .search-input {
    width: 100% !important;
  }
}
</style>