<template>
  <div>
    <div class="ideas-container q-pa-md">
      <div class="ideas-header q-mb-md row items-center">
        <h2 class="text-h4 text-weight-bold text-blue-8 q-ma-none">Идеи</h2>
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
            <q-icon name="search" color="indigo" />
          </template>
        </q-input>
        <q-btn 
          icon="add" 
          label="Предложить идею" 
          @click="addIdea"
          class="q-ml-md bg-blue-6 text-white"
          unelevated
        />
      </div>

      <div v-if="ideas && ideas.length > 0">
        <div class="ideas-list">
          <q-card 
            v-for="idea in filteredIdeas" 
            :key="idea.id" 
            class="idea-card q-mb-md idea-border"
            flat
            bordered
            @click="showIdeaDetails(idea)"
          >
            <q-card-section class="idea-header-section">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6 text-weight-bold">{{ idea.name }}</div>
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
                  <div class="idea-label text-blue-7">Проблема</div>
                  <div class="idea-value">
                    {{ idea.problem ? truncateText(idea.problem, 150) : '—' }}
                  </div>
                </div>
                <div class="idea-detail-item">
                  <div class="idea-label text-blue-7">Решение</div>
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
                <div v-if="idea.comments && idea.comments.length > 0" class="text-caption text-grey-7">
                  <q-icon name="comment" size="xs" class="q-mr-xs" />
                  {{ idea.comments.length }} комментариев
                </div>
              </div>
            </q-card-section>
          </q-card>            
          </div>
        </div>
      <div v-else>
        <div class="text-center q-pa-xl">
          <q-icon name="lightbulb_outline" size="xl" color="grey-5" />
            <div class="text-h6 text-grey-6 q-mt-md">Идей не найдено</div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для добавления/редактирования идеи -->
    <q-dialog v-model="showAddIdeaModal" persistent>
      <q-card style="min-width: 600px">
        <q-card-section class="bg-blue-6 text-white">
          <div class="text-h6">
            {{ editingIdea ? 'Редактировать идею' : 'Добавить новую идею' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-input 
            v-model="currentIdea.name" 
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
            v-model="currentIdea.resource" 
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
            @click="saveIdea"
            class="text-blue-10"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Модальное окно для просмотра идеи с комментариями -->
    <q-dialog v-model="showIdeaDetailsModal" full-width>
      <q-card style="min-width: 800px; max-width: 1000px">
        <q-card-section class="bg-blue-6 text-white q-pa-md">
          <div class="row items-center justify-between">
            <div class="text-h6">{{ viewedIdea.name }}</div>   
            <q-btn flat class="bg-red-8 text-white" label="Закрыть" color="primary" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Проблема</div>
          <div class="q-mb-md">{{ viewedIdea.problem || '—' }}</div>
          
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Решение</div>
          <div class="q-mb-md">{{ viewedIdea.solution || '—' }}</div>
          
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Ожидаемый результат</div>
          <div class="q-mb-md">{{ viewedIdea.result || '—' }}</div>
          
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Необходимые ресурсы</div>
          <div class="q-mb-md">{{ viewedIdea.resource || '—' }}</div>

          <q-separator class="q-my-md" />

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
              label="Отправить" 
              @click="addComment(viewedIdea.id!)"
              unelevated
              class="q-mb-md bg-blue-5 text-white"
            />
          </div>



          <div 
            v-for="comment in sortedComments(viewedIdea.comments || [])" 
            :key="comment.id" 
            class="comment q-mb-md"
          >
            <div class="comment-bubble">
              <div class="comment-text">
                {{ comment.comment }}
              </div>
              <div class="comment-author text-caption text-grey-7 q-mt-xs">
                — {{ comment.author.firstname + ' ' + comment.author.lastname }}, {{ formatCommentDate(comment.createdAt) }}
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
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed } from 'vue';
import * as api from '../api/ideas.api';
import { UpdateCommentDto } from '../../../backend/src/comments/dto/update-comment.dto';
import { CreateCommentDto } from '../../../backend/src/comments/dto/create-comment.dto';
import { CreateIdeaDto } from '../../../backend/src/idea/dto/create-idea.dto';

interface Author {
  id: number;
  firstname: string;
  lastname: string;
}

interface Comment {
  id: number;
  createdAt: string;
  comment: string;
  grade: string;
  author: Author;
}

interface Idea {
  comments: Comment[];
  date: string;
  customer: string;
  id: number;
  author: string;
  name: string;
  problem: string;
  resource: string;
  result: string;
  solution: string;  
}

const $q = useQuasar();

// Переменные для функционала идей

const ideas = ref<Idea[]>([]);

async function getIdeasBy() {
  try {
    const tempSession = localStorage.getItem('ttm-session')
    if (!tempSession) {
      return;
    }
    const parsedSession = JSON.parse(tempSession);
    if (!parsedSession) {
      console.error('Ошибка при получении информации о сессии');
    }

    if (parsedSession.roles.includes('admin')) {
      const response = await api.getAll2();
      ideas.value = [ ...response ];
    }
    else {
      const response = await api.getBy(parsedSession.userId);
      ideas.value = [ ...response ];
    }
  } catch {
    return;
  }
}

getIdeasBy();

const showAddIdeaModal = ref(false);
const showIdeaDetailsModal = ref(false);
const currentIdea = ref<Partial<Idea>>({});
const viewedIdea = ref<Partial<Idea>>({});
const editingIdea = ref(false);
const newComments = ref<Record<number, string>>({});
const ideaSearchText = ref('');

const filteredIdeasClock = ref(0);

const filteredIdeas = computed(() => {
  filteredIdeasClock.value;
  if (!ideaSearchText.value) return ideas.value;
  return ideas.value.filter(idea => 
    idea.name.toLowerCase().includes(ideaSearchText.value.toLowerCase()) ||
    idea.problem.toLowerCase().includes(ideaSearchText.value.toLowerCase()) ||
    idea.solution.toLowerCase().includes(ideaSearchText.value.toLowerCase()) ||
    idea.result.toLowerCase().includes(ideaSearchText.value.toLowerCase()) ||
    idea.resource.toLowerCase().includes(ideaSearchText.value.toLowerCase())
  );
});

async function addIdea() {
  currentIdea.value = {
    id: null as unknown as number,
    name: '',
    problem: '',
    solution: '',
    result: '',
    resource: '',
    author: '',
    date: ''
  };

  editingIdea.value = false;
  showAddIdeaModal.value = true;
};

async function editIdea(idea: Idea) {
  currentIdea.value = { ...idea };
  editingIdea.value = true;
  showAddIdeaModal.value = true;
};

const showIdeaDetails = (idea: Idea) => {
  viewedIdea.value = { ...idea };
  showIdeaDetailsModal.value = true;
};

async function saveIdea() {
  if (editingIdea.value) {
    const index = ideas.value.findIndex(i => i.id === currentIdea.value.id);
    if (index !== -1) {
      if (!(currentIdea.value.id && currentIdea.value.name && currentIdea.value.problem && currentIdea.value.solution && currentIdea.value.result && currentIdea.value.resource)) {
        return;
      }
      if (ideas.value[index].name !==  currentIdea.value.name) {
        await api.editIdeaname(currentIdea.value.id, currentIdea.value.name);
      }
      if (ideas.value[index].problem !==  currentIdea.value.problem) {
        await api.editIdeaproblem(currentIdea.value.id, currentIdea.value.problem);
      }
      if (ideas.value[index].solution !==  currentIdea.value.solution) {
        await api.editIdeasolution(currentIdea.value.id, currentIdea.value.solution);
      }
      if (ideas.value[index].result !==  currentIdea.value.result) {
        await api.editIdearesult(currentIdea.value.id, currentIdea.value.result);
      }
      if (ideas.value[index].resource !== currentIdea.value.resource) {
        await api.editIdearesource(currentIdea.value.id, currentIdea.value.resource);
      }
      ideas.value.splice(index, 1, {
        ...currentIdea.value as Idea,
        comments: ideas.value[index].comments
      });
    }
  } else {
    const tempSession = localStorage.getItem('ttm-session')
    if (!tempSession) {
      return;
    }
    const parsedSession = JSON.parse(tempSession);
    if (!parsedSession) {
      console.error('Ошибка при получении информации о сессии');
      return;
    }
    if (!currentIdea.value.name || !currentIdea.value.problem || !currentIdea.value.solution || !currentIdea.value.result || !currentIdea.value.resource) {
      return;
    }
    const createIdeaDto = new CreateIdeaDto();
    createIdeaDto.name = currentIdea.value.name;
    createIdeaDto.problem = currentIdea.value.problem;
    createIdeaDto.solution = currentIdea.value.solution;
    createIdeaDto.result = currentIdea.value.result;
    createIdeaDto.resource = currentIdea.value.resource;
    createIdeaDto.initiatorId = parsedSession.userId;

    const response = await api.createIdea(createIdeaDto);

    if (response) {
      console.log(response);
      ideas.value = [response as Idea, ...ideas.value]
    } else {
      return null;
    }
  }
  showAddIdeaModal.value = false;
};

const closeModal = () => {
  showAddIdeaModal.value = false;
};

async function deleteIdea(id: number) {
  $q.dialog({
    title: 'Подтверждение',
    message: 'Вы уверены, что хотите удалить эту идею?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const response = await api.deleteIdea(id);
    if (response) {
      ideas.value = ideas.value.filter(idea => idea.id !== id);
      getIdeasBy();
    }
  });
};

const convertToProject = (idea: Idea) => {
  $q.dialog({
    title: 'Преобразовать в проект',
    message: `Вы действительно хотите преобразовать идею "${idea.name}" в проект?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    $q.notify({
      type: 'positive',
      message: `Идея "${idea.name}" преобразована в проект!`
    });
  });
};

async function addComment(ideaId: number) {
  const idea = ideas.value.find(i => i.id === ideaId);
  if (idea && newComments.value[ideaId] && newComments.value[ideaId].trim() !== '') {
    const tempSession = localStorage.getItem('ttm-session')
    if (!tempSession) {
      return;
    }
    const parsedSession = JSON.parse(tempSession);
    if (!parsedSession) {
      console.error('Ошибка при получении информации о сессии');
      return;
    }

    const createCommentDto = new CreateCommentDto();

    createCommentDto.comment = newComments.value[ideaId];
    createCommentDto.grade = '';
    createCommentDto.author = parsedSession.userId;
    createCommentDto.idea = ideaId;

    const response = await api.createComment(createCommentDto);

    if (!response) {
      console.log('response равен null при создании Comment');
      return;
    }

    await getIdeasBy();

    
    viewedIdea.value = { ...ideas.value.find(i => i.id === ideaId) };

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

async function editComment(comment: Comment) {
  $q.dialog({
    title: 'Редактировать комментарий',
    prompt: {
      model: comment.comment,
      type: 'textarea'
    },
    cancel: true,
    persistent: true
  }).onOk(async (text) => {
    if (text !== null) {

      const updateCommentDto = new UpdateCommentDto();

      updateCommentDto.comment = text;
      updateCommentDto.grade = comment.grade;

      const response = await api.editComment(comment.id, updateCommentDto);

      if (!response) {
        console.log('Проблема с редактированием коммента');
        return;
      }

      comment.comment = text;
    }
  });
};

async function deleteComment(commentId: number, ideaId: number) {
  $q.dialog({
    title: 'Подтверждение',
    message: 'Удалить этот комментарий?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const idea = ideas.value.find(i => i.id === ideaId);
    if (idea) {
      
      const response = await api.deleteComment(commentId);

      if (!response) {
        
        console.log('Не удалось удалить комментарий');
        return;
      }

      idea.comments = idea.comments.filter(c => c.id !== commentId);
      viewedIdea.value = { ...ideas.value.find(i => i.id === ideaId) };
    }
  });
};

const truncateText = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const sortedComments = (comments: Comment[]) => {
  return [...comments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const formatCommentDate = (createdAt: string) => {
  const date = new Date(createdAt);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
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

.idea-border {
  border-width: 2px;
  border-style: solid;
  border-color:rgba(47, 42, 143, 0.62);
}
</style>