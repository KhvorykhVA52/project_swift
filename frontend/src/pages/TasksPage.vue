<template>
  <div>
    <!-- Переключение между задачами и идеями -->
    <q-tabs v-model="activeTab" class="text-teal">
      <q-tab name="tasks" label="Задачи" />
      <q-tab name="ideas" label="Идеи" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <!-- Панель задач (существующий функционал) -->
      <q-tab-panel name="tasks">
        <q-bar class="q-pa-lg">
          <q-btn color="primary" @click="onNewClick">Создать</q-btn>
          <div>Фильтр:</div>
          <q-checkbox v-model="onlyMyTasks" label="Только назначенные на меня" />
          <q-input class="q-px-lg" outlined dense v-model="searchText" label="Поиск">
            <template v-slot:append>
              <q-icon name="search" color="orange" />
            </template>
          </q-input>
          <q-btn icon="cancel" label="Сброс фильтра" @click="onFilterReset"></q-btn>
        </q-bar>

        <div class="row">
          <div class="col text-center text-h5">Новые</div>
          <div class="col text-center text-h5">В работе</div>
          <div class="col text-center text-h5">Выполненные</div>
        </div>

        <div class="row">
          <div class="col q-pa-sm">
            <TaskComponent
              class="q-mb-sm"
              v-for="task in newTasks"
              :key="task.id"
              :value="task"
              @onEditClick="onTaskEdit"
            ></TaskComponent>
          </div>
          <div class="col q-pa-sm">
            <TaskComponent
              class="q-mb-sm"
              v-for="task in inProgressTasks"
              :key="task.id"
              :value="task"
              @onEditClick="onTaskEdit"
            ></TaskComponent>
          </div>
          <div class="col q-pa-sm">
            <TaskComponent
              class="q-mb-sm"
              v-for="task in doneTasks"
              :key="task.id"
              :value="task"
              @onEditClick="onTaskEdit"
            ></TaskComponent>
          </div>
        </div>
      </q-tab-panel>

      <!-- Панель идей (новый функционал) -->
      <q-tab-panel name="ideas">
        <div class="ideas-container q-pa-md">
          <div class="ideas-header q-mb-md">
            <h2 class="text-h4">Идеи</h2>
            <q-input 
              v-model="ideaSearchText"
              outlined
              dense
              placeholder="Поиск идей"
              class="q-ml-md"
              style="width: 300px"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn 
              color="primary" 
              icon="add" 
              label="Предложить идею" 
              @click="addIdea"
              class="q-ml-md"
            />
          </div>

          <div class="ideas-list">
            <q-card 
              v-for="idea in filteredIdeas" 
              :key="idea.id" 
              class="idea-card q-mb-md"
            >
              <q-card-section>
                <div class="idea-header row items-center justify-between">
                  <h3 class="text-h6 q-ma-none">{{ idea.title }}</h3>
                  <div class="idea-actions">
                    <q-btn 
                      flat 
                      round 
                      icon="edit" 
                      color="primary" 
                      @click="editIdea(idea)"
                    />
                    <q-btn 
                      flat 
                      round 
                      icon="delete" 
                      color="negative" 
                      @click="deleteIdea(idea.id)"
                    />
                    <q-btn 
                      flat 
                      round 
                      icon="transform" 
                      color="positive" 
                      @click="convertToProject(idea)"
                    />
                  </div>
                </div>

                <p class="idea-description q-mt-sm">{{ idea.description }}</p>
                <p class="idea-meta q-mt-xs">
                  <span class="text-caption">Автор: {{ idea.author }}</span>
                  <span class="text-caption q-ml-md">Дата: {{ idea.date }}</span>
                </p>

                <div class="comments-section q-mt-md">
                  <q-separator class="q-mb-sm" />
                  <h4 class="text-subtitle1">Комментарии</h4>
                  
                  <q-card 
                    v-for="comment in idea.comments" 
                    :key="comment.id" 
                    flat 
                    class="comment q-mb-sm"
                  >
                    <q-card-section>
                      <p class="comment-text q-ma-none">{{ comment.text }}</p>
                      <p class="comment-author text-caption q-mt-xs">- {{ comment.author }}</p>
                      <div class="comment-actions q-mt-sm">
                        <q-btn 
                          flat 
                          dense 
                          icon="edit" 
                          size="sm" 
                          color="primary" 
                          @click="editComment(comment)"
                        />
                        <q-btn 
                          flat 
                          dense 
                          icon="delete" 
                          size="sm" 
                          color="negative" 
                          @click="deleteComment(comment.id, idea.id)"
                        />
                      </div>
                    </q-card-section>
                  </q-card>

                  <div class="add-comment q-mt-md">
                    <q-input
                      v-model="newComments[idea.id]"
                      filled
                      type="textarea"
                      placeholder="Добавить комментарий"
                      autogrow
                    />
                    <q-btn 
                      class="q-mt-sm"
                      color="primary" 
                      label="Отправить" 
                      @click="addComment(idea.id)"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Модальное окно для добавления/редактирования идеи -->
        <q-dialog v-model="showAddIdeaModal">
          <q-card style="min-width: 400px">
            <q-card-section>
              <div class="text-h6">{{ editingIdea ? 'Редактировать идею' : 'Добавить новую идею' }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input 
                v-model="currentIdea.title" 
                label="Название" 
                class="q-mb-md"
              />
              <q-input 
                v-model="currentIdea.description" 
                label="Описание" 
                type="textarea"
                autogrow
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Отмена" color="primary" v-close-popup />
              <q-btn 
                label="Сохранить" 
                color="primary" 
                @click="saveIdea"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import TaskEditForm from '../components/TaskEditForm.vue';
import TaskComponent from 'src/components/TaskComponent.vue';
import { computed, onMounted, ref } from 'vue';
import * as api from '../api/tasks.api';
import { TaskDto, TaskStatus } from '../../../backend/src/common/types';
import { useMainStore } from 'src/stores/main-store';
import { storeToRefs } from 'pinia';

interface Comment {
  id: number;
  text: string;
  author: string;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  comments: Comment[];
}

const $q = useQuasar();
const mainStore = useMainStore();
let { userId } = storeToRefs(mainStore);

// Переменные для функционала задач (существующий код)
const onlyMyTasks = ref(false);
const searchText = ref('');
const allTasks = ref([] as TaskDto[]);
const activeTab = ref('tasks');

const filteredTasks = computed(() => {
  return allTasks.value.filter((task) => {
    console.log('Task filter.');

    let visible = true;
    if (onlyMyTasks.value && task.assignee.id != userId.value) {
      visible = false;
    }

    if (
      searchText.value.length > 1 &&
      task.title.indexOf(searchText.value) < 0
    ) {
      visible = false;
    }

    return visible;
  });
});

const newTasks = computed(() =>
  filteredTasks.value.filter((v) => v.status == TaskStatus.new)
);
const inProgressTasks = computed(() =>
  filteredTasks.value.filter((v) => v.status == TaskStatus.inProgress)
);
const doneTasks = computed(() =>
  filteredTasks.value.filter((v) => v.status == TaskStatus.done)
);

// Переменные для функционала идей (новый код)
const ideas = ref<Idea[]>([
  {
    id: 1,
    title: 'Первая идея',
    description: 'Это описание первой идеи',
    author: 'Иван Иванов',
    date: '05.04.2025',
    comments: [
      { id: 1, text: 'Хорошая идея!', author: 'Петр Петров' },
      { id: 2, text: 'Нужно доработать', author: 'Сидор Сидоров' }
    ]
  },
  {
    id: 2,
    title: 'Вторая идея',
    description: 'Описание второй идеи',
    author: 'Петр Петров',
    date: '05.04.2025',
    comments: []
  }
]);

const showAddIdeaModal = ref(false);
const currentIdea = ref<Omit<Idea, 'comments'> & { comments?: Comment[] }>({
  id: null as unknown as number,
  title: '',
  description: '',
  author: 'Иван Иванов',
  date: ''
});
const editingIdea = ref(false);
const newComments = ref<Record<number, string>>({});
const ideaSearchText = ref('');

const filteredIdeas = computed(() => {
  if (!ideaSearchText.value) return ideas.value;
  return ideas.value.filter(idea => 
    idea.title.toLowerCase().includes(ideaSearchText.value.toLowerCase()) ||
    idea.description.toLowerCase().includes(ideaSearchText.value.toLowerCase())
  );
});

// Методы для функционала задач (существующий код)
const getTasksFromServer = async () => {
  const response = await api.getTasks();
  allTasks.value = response;
};

const onNewClick = async () => {
  $q.dialog({
    component: TaskEditForm,
    componentProps: {
      new: true,
    },
  })
    .onOk(async () => {
      console.log('OK');
      await getTasksFromServer();
    })
    .onCancel(() => {
      console.log('Cancel');
    });
};

const onTaskEdit = (value: TaskDto) => {
  console.log(value);
  $q.dialog({
    component: TaskEditForm,
    componentProps: {
      new: false,
      task: value,
    },
  })
    .onOk(async () => {
      console.log('OK');
      await getTasksFromServer();
    })
    .onCancel(() => {
      console.log('Cancel');
    });
};

const onFilterReset = () => {
  onlyMyTasks.value = false;
  searchText.value = '';
};

// Методы для функционала идей (новый код)
const addIdea = () => {
  currentIdea.value = {
    id: null as unknown as number,
    title: '',
    description: '',
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

const saveIdea = () => {
  if (editingIdea.value) {
    const index = ideas.value.findIndex(i => i.id === currentIdea.value.id);
    if (index !== -1) {
      ideas.value.splice(index, 1, {
        ...currentIdea.value,
        comments: ideas.value[index].comments
      });
    }
  } else {
    currentIdea.value.id = ideas.value.length + 1;
    currentIdea.value.date = new Date().toISOString().split('T')[0];
    ideas.value.unshift({
      ...currentIdea.value,
      comments: []
    });
  }
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
    idea.comments.push({
      id: idea.comments.length + 1,
      text: newComments.value[ideaId],
      author: 'Иван Иванов'
    });
    newComments.value[ideaId] = '';
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

onMounted(async () => {
  await getTasksFromServer();
});
</script>

<style scoped>
.ideas-container {
  max-width: 1200px;
  margin: 0 auto;
}

.ideas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.idea-card {
  transition: box-shadow 0.3s;
}

.idea-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.idea-header {
  margin-bottom: 8px;
}

.idea-description {
  color: var(--secondary-color);
}

.idea-meta {
  color: var(--secondary-color);
  opacity: 0.7;
}

.comment {
  background-color: var(--message-box-hover);
  border-radius: 4px;
}

.comment-text {
  margin-bottom: 4px;
}

.comment-author {
  font-style: italic;
}

.add-comment {
  margin-top: 16px;
}

@media (max-width: 600px) {
  .ideas-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .ideas-header .q-btn {
    margin-top: 10px;
  }
}
</style>