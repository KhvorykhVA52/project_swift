<template>
    <!-- окно с идеями -->
    <div class="row q-gutter-md">
        <div
        v-for="(idea, index) in ideas"
        :key="index"
        class="col-xs-12 col-sm-6"
        style="width: calc((100% - 240px)/2);"
        >
            <q-card
                :ref="(el: QCard | null) => ideaCards[index] = el"
                :id="'idea-' + index"
                class="my-card"
                style="height: 250px; display: flex; flex-direction: column;"
                @click="ShowIdeaDetailsModal(idea)"
            >
                <q-card-section class="q-mb-md">
                    <div class="text-h6">{{ slicedStr({str: idea.name, length: 50}) }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none perenos-text">
                    {{ slicedStr({str: idea.solution, length: 200}) }}
                </q-card-section>

                <q-card-section style="margin-top: auto">
                    <span class="text-subtitle1 text-weight-medium q-mb-sm dark-blue-text bold-text">Инициатор</span>: 
                    <span class="q-mb-md semi-bold">
                        {{ getAuthor(idea.initiator) }}
                    </span>
                        //
                    <span class="text-subtitle2 text-weight-medium q-mb-sm text-blue bold-text">
                        Статус:
                    </span>

                    <span class="q-mb-md semi-bold">
                        {{ idea.status }}
                    </span>
                </q-card-section>

            </q-card>
        </div>
    </div>
  
    <!-- Модальное окно для просмотра идеи -->
    <q-dialog v-model="showIdeaDetailsModal" full-width >
        <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="bg-blue-6 text-white q-pa-md">
                <div class="row items-center justify-between">
                    <div class="text-h6 perenos-text">{{ viewedIdea.name }}</div>
                    <div class="row items-center justify-end">
                    <q-btn flat class="bg-red-8 text-white" label="Закрыть" color="primary" v-close-popup />
                    <q-btn flat class="bg-yellow-10 text-white space-element" label="Пригласить команду" color="primary" @click="ShowSendInviteModal" />
                    </div>
                </div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <div class="text-subtitle1 text-weight-medium q-mb-sm dark-blue-text bold-text">Инициатор</div>
                <div class="q-mb-md semi-bold perenos-text">{{ viewedIdea.initiator?((viewedIdea.initiator.firstname || viewedIdea.initiator.lastname)? (viewedIdea.initiator.firstname || '') + ' ' + (viewedIdea.initiator.lastname || ''): '—'): '—' }}</div>

                <div class="text-subtitle1 text-weight-medium q-mb-sm dark-blue-text">Статус</div>
                <div class="q-mb-md perenos-text"> {{viewedIdea.status?viewedIdea.status:'Ошибка'}} </div>

                <div class="text-subtitle1 text-weight-medium q-mb-sm text-blue-8">Проблема</div>
                <div class="q-mb-md perenos-text">{{ viewedIdea.problem || '—' }}</div>
                
                <div class="text-subtitle1 text-weight-medium q-mb-sm text-blue-8">Решение</div>
                <div class="q-mb-md perenos-text">{{ viewedIdea.solution || '—' }}</div>
                
                <div class="text-subtitle1 text-weight-medium q-mb-sm text-blue-8">Ожидаемый результат</div>
                <div class="q-mb-md perenos-text">{{ viewedIdea.result || '—' }}</div>
                
                <div class="text-subtitle1 text-weight-medium q-mb-sm text-blue-8">Необходимые ресурсы</div>
                <div class="q-mb-md perenos-text">{{ viewedIdea.resource || '—' }}</div>

                <q-separator class="q-my-md" />
            </q-card-section>
        </q-card>
    </q-dialog>

    <!-- Модальное окно отправки приглашения -->
    <q-dialog v-model="showSendInviteModal">
        <q-card style="width: 500px; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6 text-blue-9">Команды</div>
            </q-card-section>

            <q-card-section style="max-height: 500px; overflow-y: auto;">
                <div v-for="team in teams" :key="team.id" class="team-block row items-center no-wrap">
                    <q-btn icon="add" size="sm" color="positive" class="send-invite-button" @click="ShowCheckSendingModal(team)" />
                    <div>
                        <div class="text-subtitle1 perenos-text">Название: {{ team.name }}</div>
                        <div class="text-caption perenos-text">Описание: {{ team.description }}</div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    <!-- Модальное окно "Вы уверены?" при отправки приглашения -->
    <q-dialog v-model="showCheckSendingModal" @hide="CloseCheckSendingModal">
        <q-card-section style="max-height: 500px; overflow-y: auto;">
            <div class="team-block">
                <div q-if="errorMessage">
                    <div class="text-subtitle1 perenos-text" style="color: red; font-size: 30px;"> {{ errorMessage }} </div>
                </div>
                <div class="text-subtitle1 perenos-text"> Вы уверены? </div>
                <q-btn color="positive" @click="createInvite">Да</q-btn>
                <q-btn color="negative" class="space-element" @click="CloseCheckSendingModal">Нет</q-btn>
                <div class="text-subtitle1 perenos-text">Название: {{ viewedTeam.name }}</div>
                <div class="text-caption perenos-text">Описание: {{ viewedTeam.description }}</div>
            </div>
        </q-card-section>
    </q-dialog>
</template>

<script setup lang="ts">

interface Invite {
    ideaId: number;
    teamId: number;
    isInitiatorInviter: boolean;
}

async function createInvite() {
    if (viewedIdea.value.id && viewedTeam.value.id) {
        const invite: Invite = {ideaId: viewedIdea.value.id, teamId: viewedTeam.value.id, isInitiatorInviter: true};
        const response = await api.createInvite(invite);
        if (response) {
            errorMessage.value = '';
            showCheckSendingModal.value = false;
            return;
        }
    }
    errorMessage.value = 'Ошибка';
}

function CloseCheckSendingModal() {
    errorMessage.value = '';
    showCheckSendingModal.value = false;
}

function ShowCheckSendingModal(team: Team) {
    viewedTeam.value = team;
    showCheckSendingModal.value = true;
}

function ShowSendInviteModal() {
    showSendInviteModal.value = true;
}

function slicedStr(input: {str: string, length: number}) {
    if (!input.str) {
        return ' ';
    }

    if (input.str.length <= input.length) {
        return input.str;
    }
    return input.str.substring(0, input.length);
}

function ShowIdeaDetailsModal(idea: Idea) {
    viewedIdea.value = { ...idea };
    showIdeaDetailsModal.value = true;
}

function getAuthor(author: {firstname: string, lastname: string}) {
    return((author.firstname?author.firstname+' ':'') + (author.lastname?author.lastname:' '));
}

import { QCard } from 'quasar';
import * as api from '../api/acceptedideas.api';
import { ref, onMounted } from 'vue';

interface Idea {
    id: number;
    name: string;
    problem: string;
    solution: string;
    result: string;
    resource: string;
    status: string;
    initiator: {id: number, firstname: string, lastname: string};
    createdAt: string;
}

interface Team {
    id: number;
    name: string;
    description: string;
}

const ideas = ref<Idea[]>([]);
const ideaCards = ref<(QCard | null)[]>([]);
const showIdeaDetailsModal = ref(false);
const viewedIdea = ref<Partial<Idea>>({});
const showSendInviteModal = ref(false);
const teams = ref<Team[]>([]);
const viewedTeam =  ref<Partial<Team>>({});
const showCheckSendingModal = ref(false);
const errorMessage = ref('');

async function getAllTeams() {
    const response = await api.getAllTeams();

    if (response) {
        teams.value = [ ...response ];
    }

    return null;
}

async function loadIdeas() {
    const response = await api.getAll();

    if (response) {
        ideas.value = [ ...response ];
        return true;
    }

    return false;
}

onMounted(() => {
    loadIdeas();
    getAllTeams();
})

</script>

<style>

.two-columns-grid {
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px; /* Отступы между блоками */
}

.send-invite-button {
    margin-right: 8px;
}

.team-block {
  padding: 8px;
  margin-bottom: 16px;
  background-color:rgb(0, 247, 255);
  border-radius: 8px;
}

.space-element {
    margin-left: 8px;
}

.perenos-text {
    width: 100%;
    white-space: normal;
    word-wrap: break-word;
}

.dark-blue-text {
  color: darkblue;
}

.bold-text {
  font-weight: bold;
}

.semi-bold {
  font-weight: 600;
}

</style>