<template>
    <!-- окно с идеями -->
    <div class="header q-mb-md row items-center">
        <q-input 
            v-model="ideaSearchText"
            outlined
            dense
            placeholder="Поиск идей..."
            class="search-input"
            style="width: 600px; margin: 0 auto;"
            >
        <template v-slot:append>
            <q-icon name="search" color="indigo" />
            </template>
        </q-input>
    </div>
    
    <div class="row q-gutter-md">
        <div
        v-for="(idea, index) in filteredIdeas"
        :key="index"
        class="col-xs-12 col-sm-6"
        style="width: calc((100% - 33px)/2);"
        >
            <q-card
                :ref="(el: QCard | null) => ideaCards[index] = el"
                :id="'idea-' + index"
                class="my-card"
                style="height: 250px; display: flex; flex-direction: column;"
                @click="ShowIdeaDetailsModal(idea)"
            >
                <q-card-section class="q-mb-md">
                    <div class="text-h6">{{ slicedStr({str: idea.name, length: 54}) }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none perenos-text">
                    {{ slicedStr({str: idea.solution, length: 300}) }}
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
    <q-dialog v-model="showIdeaDetailsModal" full-width @hide="hidingIdeaDetailsModal">
        <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="bg-blue-6 text-white q-pa-md">
                <div class="row items-center justify-between">
                    <div class="text-h6 perenos-text">{{ viewedIdea.name }}</div>
                    <div class="row items-center justify-end">
                        <q-btn flat class="bg-red-8 text-white" label="Закрыть" color="primary" v-close-popup />
                        <q-btn flat class="bg-green-10 text-white space-element" label="Список кандидатов" color="primary" @click="ShowInvitesModal" />
                        <q-btn flat class="bg-yellow-10 text-white space-element" label="Пригласить команду" color="primary" @click="ShowSendInviteModal" />
                        <q-btn flat class="bg-yellow-10 text-white space-element" label="Изменить стек" color="primary" @click="ShowTechStackModal" />                                        
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
        <q-card style="width: 800px; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6 text-blue-14">Команды</div>
            </q-card-section>

            <div class="header q-mb-md row items-center">
                <q-input 
                    v-model="sendingInviteSearchText"
                    outlined
                    dense
                    placeholder="Поиск команд..."
                    class="search-input"
                    style="width: max; padding: 0px 16px;"
                    >
                <template v-slot:append>
                    <q-icon name="search" color="indigo" />
                    </template>
                </q-input>
            </div>

            <q-card-section style="max-height: 500px; overflow-y: auto;">
                <div v-for="team in filteredTeams" :key="team.id" class="team-block row items-center no-wrap">
                    <q-btn v-if="team.canInvite" icon="add" size="sm" color="positive" class="send-invite-button" @click="ShowCheckSendingModal(team)" />
                    <q-btn v-if="!team.canInvite" icon="remove" size="sm" class="send-invite-button bg-grey-6" @click="showERRORmodal('Ошибка: данная команда уже в списке кандидатов')" />
                    <div style="height: 140px" class="perenos-text">
                        <div class="text-subtitle1" style="width: 500px; height: 20px; overflow: hidden;">Название: {{ team.name }}</div>
                        <div class="text-caption" style="margin-top: 5px;">Описание: {{ team.description }}</div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    <!-- Модальное окно "Вы уверены?" при отправки приглашения -->
    <q-dialog v-model="showCheckSendingModal" @hide="CloseCheckSendingModal">
        <q-card-section style="max-height: 500px; overflow-y: auto;">
            <div class="team-block">
                <div class="text-subtitle1 perenos-text"> Вы уверены? </div>
                <q-btn color="positive" @click="createInvite">Да</q-btn>
                <q-btn color="negative" class="space-element" @click="CloseCheckSendingModal">Нет</q-btn>
                <div class="text-subtitle1 perenos-text">Название: {{ viewedTeam.name }}</div>
                <div class="text-caption perenos-text">Описание: {{ viewedTeam.description }}</div>
            </div>
        </q-card-section>
    </q-dialog>

    <!-- Модальное окно просмотра приглашений (кандидатов) -->
    <q-dialog v-model="showInvitesModal">
        <q-card style="width: 800px; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6 text-blue-14">Команды</div>
            </q-card-section>

            <div class="header q-mb-md row items-center">
            <q-input 
                v-model="invitesSearchText"
                outlined
                dense
                placeholder="Поиск команд..."
                class="search-input"
                style="width: max; padding: 0px 16px;"
                >
            <template v-slot:append>
                <q-icon name="search" color="indigo" />
                </template>
            </q-input>
        </div>

            <q-card-section style="max-height: 500px; overflow-y: auto;">
                <div v-for="invite in filteredInvites" :key="invite.team.id" class="team-block row items-center no-wrap" style="position: relative">
                    <q-btn v-if="invite.isInitiatorInviter" icon="close" size="sm" color="negative" class="send-invite-button" @click="ShowCheckCancelingModal(invite)"/>
                    <q-btn v-if="!invite.isInitiatorInviter" icon="remove" size="sm" class="send-invite-button bg-grey-6" style="cursor: not-allowed;" @click="showERRORmodal('Ошибка: это не приглашение')"></q-btn>
                    <div>
                        <div class="text-subtitle1 perenos-text">Название: {{ invite.team.name }}</div>
                        <div class="text-caption perenos-text">Описание: {{ invite.team.description }}</div>
                        <span class="text-subtitle2 text-weight-medium q-mb-sm text-orange-14 bold-text">
                            Статус:
                        </span>

                        <span class="q-mb-md semi-bold">
                            {{ invite.status }}
                        </span>
                    </div>

                    <div v-if="!ideaGotTeam" style="position: absolute; right: 2px; display: flex; flex-direction: column; align-items: flex-end;">
                        <q-btn v-if="!invite.isInitiatorInviter" size="sm" class="send-invite-button bg-green-6" style="width: 80px; box-sizing: border-box;" @click="ShowCheckAcceptingTeamModal(invite)">Принять</q-btn>
                        <q-btn v-if="!invite.isInitiatorInviter" size="sm" class="send-invite-button bg-red-6" style="margin-top: 5px; width: 80px; box-sizing: border-box;" @click="ShowCheckDenyingTeamModal(invite)">Отклонить</q-btn>
                        <q-btn v-if="invite.isInitiatorInviter" size="sm" class="send-invite-button bg-grey-6" style="width: 80px; box-sizing: border-box; text-decoration: line-through; cursor: not-allowed; opacity: 0.7; font-style: italic;" @click="showERRORmodal('Ошибка: это приглашённая команда')">Принять</q-btn>
                        <q-btn v-if="invite.isInitiatorInviter" size="sm" class="send-invite-button bg-grey-6" style="margin-top: 5px; width: 80px; box-sizing: border-box; text-decoration: line-through; cursor: not-allowed; opacity: 0.7; font-style: italic;" @click="showERRORmodal('Ошибка: это приглашённая команда')">Отклонить</q-btn>
                    </div>

                    <div v-if="ideaGotTeam" style="position: absolute; right: 2px; display: flex; flex-direction: column; align-items: flex-end;">
                        <q-btn size="sm" class="send-invite-button bg-grey-6" style="width: 80px; box-sizing: border-box; text-decoration: line-through; cursor: not-allowed; opacity: 0.7; font-style: italic;" @click="showERRORmodal('Ошибка: команда уже найдена')">Принять</q-btn>
                        <q-btn size="sm" class="send-invite-button bg-grey-6" style="margin-top: 5px; width: 80px; box-sizing: border-box; text-decoration: line-through; cursor: not-allowed; opacity: 0.7; font-style: italic;" @click="showERRORmodal('Ошибка: команда уже найдена')">Отклонить</q-btn>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    <!-- Модальное окно "Вы уверены?" при отмене приглашения (инициатор) -->
    <q-dialog v-model="showCheckCancelingModal" @hide="CloseCheckCancelingModal">
        <q-card-section style="max-height: 500px; overflow-y: auto;">
            <div class="team-block">
                <div class="text-subtitle1 perenos-text"> Отозвать приглашение? </div>
                <q-btn color="positive" @click="cancelInvite">Да</q-btn>
                <q-btn color="negative" class="space-element" @click="CloseCheckCancelingModal">Нет</q-btn>
                <div v-if="viewedInvite.team" class="text-subtitle1 perenos-text">Название: {{ viewedInvite.team.name }}</div>
                <div v-if="viewedInvite.team" class="text-caption perenos-text">Описание: {{ viewedInvite.team.description }}</div>
            </div>
        </q-card-section>
    </q-dialog>

    <!-- Модальное временное окно ОК -->
    <div v-if="showOK" :class="['status-ok-message', { 'hidden': !showOK }]">
      {{ message }}
    </div>

    <!-- Модальное временное окно Ошибка -->
    <div v-if="showERROR" :class="['status-error-message', { 'hidden': !showERROR }]">
      {{ message }}
    </div>

    <!-- Модальное окно "Вы уверены?" при отказе от команды -->
    <q-dialog v-model="showCheckDenyingTeamModal">
        <q-card-section style="max-height: 500px; overflow-y: auto;">
            <div class="team-block">
                <div class="text-subtitle1 perenos-text"> Отказаться от данной команды? </div>
                <q-btn color="positive" @click="denyTeam">Да</q-btn>
                <q-btn color="negative" class="space-element" @click="closeCheckDenyingTeamModal">Нет</q-btn>
                <div v-if="viewedInvite.team" class="text-subtitle1 perenos-text">Название: {{ viewedInvite.team.name }}</div>
                <div v-if="viewedInvite.team" class="text-caption perenos-text">Описание: {{ viewedInvite.team.description }}</div>
            </div>
        </q-card-section>
    </q-dialog>

    <!-- Модальное окно "Вы уверены?" при принятии команды -->
    <q-dialog v-model="showCheckAcceptingTeamModal">
        <q-card-section style="max-height: 500px; overflow-y: auto;">
            <div class="team-block">
                <div class="text-subtitle1 perenos-text"> Принять данную команду? </div>
                <q-btn color="positive" @click="acceptTeam">Да</q-btn>
                <q-btn color="negative" class="space-element" @click="closeCheckAcceptingTeamModal">Нет</q-btn>
                <div v-if="viewedInvite.team" class="text-subtitle1 perenos-text">Название: {{ viewedInvite.team.name }}</div>
                <div v-if="viewedInvite.team" class="text-caption perenos-text">Описание: {{ viewedInvite.team.description }}</div>
            </div>
        </q-card-section>
    </q-dialog>

    <!-- Модальное окно редактирования стека идеи -->
    <q-dialog v-model="showTechStack">
      <q-card class="tech-stack-dialog" style="background-color: rgba(216, 221, 255);">
        <q-card-section style="position: sticky; top: 0; z-index: 10000; background-color: rgba(216, 221, 255); border-bottom: 1px solid rgb(128, 128, 128)">
          <div style="display: flex; justify-content: center; align-items: center;">
            <q-btn flat label="Отмена" color="black" style="
            border-radius: 8px;
            padding: 8px 16px;
            display: inline-block;
            background-color: rgba(255, 0, 0, 0.63);
            "
            v-close-popup />
            <q-btn flat label="Сохранить" color="black" style="
            border-radius: 8px;
            padding: 8px 16px;
            display: inline-block;
            margin-left: 8px;
            background-color: rgba(0, 255, 0, 0.63);
            "
            @click="updateTechStack" v-close-popup />
          </div>

          <div class="text-h6">Стек технологий</div>
          <q-input 
            v-model="technologySearchText"
            outlined
            dense
            placeholder="Найти..."
            class="search-input"
            color="black"
            style="padding;"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="tech-category" v-for="(category, name) in filteredtechStack" :key="name">
            <div v-if="category && category.length > 0 && category[0].name">
                <h3>{{ getCategoryName(name) }}</h3>
                <div v-if="getCategoryName(name) == 'Языки разработки'">
                    <div class="tech-items">
                        <q-checkbox
                        v-for="item in category"
                        :key="item.name"
                        v-model="item.selected"
                        :label="''"
                        class="styled-checkbox checkbox-left"
                        >
                        <template v-slot:default>
                            <span class="word-background languages-background" style="background-size: 75% 100%;">{{ item.name }}</span>
                        </template>
                        </q-checkbox>
                    </div>
                </div>
                <div v-if="getCategoryName(name) == 'Фреймворки'">
                    <div class="tech-items">
                        <q-checkbox
                        v-for="item in category"
                        :key="item.name"
                        v-model="item.selected"
                        :label="''"
                        class="styled-checkbox checkbox-left"
                        >
                        <template v-slot:default>
                            <span class="word-background frameworks-background">{{ item.name }}</span>
                        </template>
                        </q-checkbox>
                    </div>
                </div>
                <div v-if="getCategoryName(name) == 'Базы данных'">
                    <div class="tech-items">
                        <q-checkbox
                        v-for="item in category"
                        :key="item.name"
                        v-model="item.selected"
                        :label="''"
                        class="styled-checkbox checkbox-left"
                        >
                        <template v-slot:default>
                            <span class="word-background databases-background" style="background-size: 100% 100%;">{{ item.name }}</span>
                        </template>
                        </q-checkbox>
                    </div>
                </div>
                <div v-if="getCategoryName(name) == 'DevOps'">
                    <div class="tech-items">
                        <q-checkbox
                        v-for="item in category"
                        :key="item.name"
                        v-model="item.selected"
                        :label="''"
                        class="styled-checkbox checkbox-left"
                        >
                        <template v-slot:default>
                            <span class="word-background devops-background">{{ item.name }}</span>
                        </template>
                        </q-checkbox>
                    </div>
                </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup lang="ts">

async function hidingIdeaDetailsModal() {
    showIdeaDetailsModal.value = false;
}

async function loadIdeaStack() {
    if (!viewedIdea.value || !viewedIdea.value.id) {
        return null;
    }

    const response = await api.getStack(viewedIdea.value.id);

    if (!response) {
        return null;
    }
    
    Object.values(techStack.value).forEach(items => {
        items.forEach(item => {
            item.selected = response.includes(item.name) || false;
        });
    });
}

async function updateTechStack() {
    if (!viewedIdea.value.id) {
        return null;
    }

    selectedStack.value = [];
    Object.values(techStack.value).forEach(category => {
        category.forEach(item => {
            if (item.selected) selectedStack.value.push(item.name);
        });
    });
    
    await api.updateStack(viewedIdea.value.id, selectedStack.value);
}

async function ShowTechStackModal() {
    showTechStack.value = true;
}

function getCategoryName(key: string) {
    if (key != 'languages' && key != 'frameworks' && key != 'databases' && key != 'devops') {
        return key;
    }
    const names = {
    'languages': 'Языки разработки',
    'frameworks': 'Фреймворки',
    'databases': 'Базы данных',
    'devops': 'DevOps'
    };
    return names[key] || key;
}

const filteredtechStack = computed(() => {
    if (!technologySearchText.value) {
        return techStack.value;
    }

    const mainFiltered = {'languages': 
        [{name: '', selected: false}],
        'frameworks': [{name: '', selected: false}],
        'databases': [{name: '', selected: false}],
        'devops': [{name: '', selected: false}]};
    
    for (const tempCategory in techStack.value) {
        if (techStack.value.hasOwnProperty(tempCategory)) {
            if (tempCategory != 'languages' && tempCategory != 'frameworks' && tempCategory != 'databases' && tempCategory != 'devops') {
                continue;
            }
            const temp2Category = techStack.value[tempCategory];
            if (Array.isArray(temp2Category)) {
                const filtered = temp2Category.filter(item =>
                    item.name.toLowerCase().includes(technologySearchText.value.toLowerCase())
                );
                if (filtered.length > 0) {
                    mainFiltered[tempCategory] = filtered;
                }   
            }
        }
    }
    return mainFiltered;
})

const filteredTeams = computed(() => {
    if (!sendingInviteSearchText.value) {
        return teams.value;
    }

    const query = sendingInviteSearchText.value.toLowerCase();
    const searchTerms = query.split(' ').filter(term => term !== '');

    let filteredResults = teams.value;

    for (const term of searchTerms) {
        filteredResults = filteredResults.filter(team => {
        const name = (team.name || '').toLowerCase();
        const description = (team.description || '').toLowerCase();

        return (
            name.includes(term) ||
            description.includes(term)
        );
        });
    }

    return filteredResults;
})

const filteredInvites = computed(() => {
    if (!invitesSearchText.value) {
        return invites.value;
    }

    const query = invitesSearchText.value.toLowerCase();
    const searchTerms = query.split(' ').filter(term => term !== '');

    let filteredResults = invites.value;

    for (const term of searchTerms) {
        filteredResults = filteredResults.filter(invite => {
        const status = (invite.status || '').toLowerCase();
        const name = (invite.team.name || '').toLowerCase();
        const description = (invite.team.description || '').toLowerCase();

        return (
            status.includes(term) ||
            name.includes(term) ||
            description.includes(term)
        );
        });
    }

    return filteredResults;
})

const filteredIdeas = computed(() => {
    if (!ideaSearchText.value) {
        return ideas.value;
    }
    
    const query = ideaSearchText.value.toLowerCase();
    const searchTerms = query.split(' ').filter(term => term !== '');

    let filteredResults = ideas.value;

    for (const term of searchTerms) {
        filteredResults = filteredResults.filter(idea => {
        const name = (idea.name || '').toLowerCase();
        const problem = (idea.problem || '').toLowerCase();
        const solution = (idea.solution || '').toLowerCase();
        const result = (idea.result || '').toLowerCase();
        const resource = (idea.resource || '').toLowerCase();
        const status = (idea.status || '').toLowerCase();
        const initiatorFirstname = (idea.initiator.firstname || '').toLowerCase();
        const initiatorLastname = (idea.initiator.lastname || '').toLowerCase();

        return (
            name.includes(term) ||
            problem.includes(term) ||
            solution.includes(term) ||
            result.includes(term) ||
            resource.includes(term) ||
            status.includes(term) ||
            initiatorFirstname.includes(term) ||
            initiatorLastname.includes(term)
        );
        });
    }

    return filteredResults;
})

async function closeCheckAcceptingTeamModal() {
    showCheckAcceptingTeamModal.value = false;
}

async function ShowCheckAcceptingTeamModal(invite: InviteList) {
    viewedInvite.value = invite;
    showCheckAcceptingTeamModal.value = true;
}

async function acceptTeam() {
    if(!viewedInvite.value.id) {
        return null;
    }

    const response = await api.responseInvite(viewedInvite.value.id, 'Принято');

    if (response) {
        await showOKmodal('Команда принята: ' + viewedInvite.value.team?.name);
        await getInvitesBy();
        await loadIdeas();
        showCheckAcceptingTeamModal.value = false;
    }
}

async function denyTeam() {
    if(!viewedInvite.value.id) {
        return null;
    }

    const response = await api.responseInvite(viewedInvite.value.id, 'Отклонено');

    if (response) {
        await showOKmodal('Команда отклонена: ' + viewedInvite.value.team?.name);
        await getInvitesBy();
        showCheckDenyingTeamModal.value = false;
    }
}

async function showOKmodal(text: string) {
    showOK.value = true;
    message.value = text;

    if (timerId.value) {
        clearTimeout(timerId.value);
    }

    timerId.value = setTimeout(() => {
        showOK.value = false;
        message.value = '';
        timerId.value = null;
    }, 2000);
}

async function showERRORmodal(text: string) {
    showERROR.value = true;
    message.value = text;

    if (timerId.value) {
        clearTimeout(timerId.value);
    }

    timerId.value = setTimeout(() => {
        showERROR.value = false;
        message.value = '';
        timerId.value = null;
    }, 2000);
}

async function closeCheckDenyingTeamModal() {
    showCheckDenyingTeamModal.value = false;
}

async function ShowCheckDenyingTeamModal(invite: InviteList) {
    viewedInvite.value = invite;
    showCheckDenyingTeamModal.value = true;
}

async function CloseCheckCancelingModal() {
    showCheckCancelingModal.value = false;
}

async function ShowCheckCancelingModal(invite: InviteList) {
    viewedInvite.value = invite;

    showCheckCancelingModal.value = true;
}

async function cancelInvite() {
    if (!viewedInvite.value || !viewedInvite.value.isInitiatorInviter || !viewedInvite.value.id || !viewedInvite.value.team || !viewedInvite.value.team.name) {
        return null;
    }
    
    const response = await api.cancelInvite(viewedInvite.value.id);

    if (response) {
        await showOKmodal('Приглашение команды "' + viewedInvite.value?.team?.name + '" отозвано');

        invites.value = invites.value.filter(invite => invite.id !== viewedInvite.value.id);
        showCheckCancelingModal.value = false;
    }

    return null;
}

async function ShowInvitesModal() {
    const response = await getInvitesBy();

    if (response) {
        showInvitesModal.value = true;
    }
}

async function getInvitesBy() {
    if (!viewedIdea.value.id) {
        return null;
    }

    const response = await api.getInvitesBy(viewedIdea.value.id);

    if (response) {
        const invitesIs: InviteList[] = [];
        const invitesIsNot: InviteList[] = [];

        for (const invite of response) {
            if (invite.isInitiatorInviter) {
                invitesIs.push(invite);
                continue;
            }
            invitesIsNot.push(invite);            
        }


        invites.value = [ ...invitesIs, ...invitesIsNot ];

        if (viewedIdea.value.status == StatusIdea.teamIsFinded) {
            ideaGotTeam.value = true;
        } else {
            ideaGotTeam.value = false;
        }

        return true;
    }

    return false;
}

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
            showOK.value = true;
            await showOKmodal('Приглашение отправлено!');

            await canInviteCheck();

            showCheckSendingModal.value = false;
            return;
        }
    }
}

function CloseCheckSendingModal() {
    showCheckSendingModal.value = false;
}

function ShowCheckSendingModal(team: Team) {
    viewedTeam.value = team;
    showCheckSendingModal.value = true;
}

async function canInviteCheck() {
    await getInvitesBy();
    
    teams.value.forEach(team => {
        team.canInvite = invites.value.some(invite => invite.team.id === team.id) ? false : true;
    });
}

async function ShowSendInviteModal() {

    await canInviteCheck();
    
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

async function ShowIdeaDetailsModal(idea: Idea) {
    viewedIdea.value = { ...idea };
    await loadIdeaStack();
    showIdeaDetailsModal.value = true;
}

function getAuthor(author: {firstname: string, lastname: string}) {
    return((author.firstname?author.firstname+' ':'') + (author.lastname?author.lastname:' '));
}

import { QCard } from 'quasar';
import * as api from '../api/acceptedideas.api';
import { ref, onMounted, computed } from 'vue';
import { StatusIdea } from '../../../backend/src/common/types';

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
    stack: string[];
}

interface InviteList {
    id: number;
    idea: Idea;
    team: Team;
    isInitiatorInviter: boolean;
    status: string;
}

interface Team {
    id: number;
    name: string;
    description: string;
    canInvite: boolean;
}

const ideas = ref<Idea[]>([]);
const ideaCards = ref<(QCard | null)[]>([]);
const showIdeaDetailsModal = ref(false);
const viewedIdea = ref<Partial<Idea>>({});
const showSendInviteModal = ref(false);
const teams = ref<Team[]>([]);
const viewedTeam =  ref<Partial<Team>>({});
const showCheckSendingModal = ref(false);
const invites = ref<InviteList[]>([]);
const showInvitesModal = ref(false);
const showCheckCancelingModal = ref(false);
const viewedInvite = ref<Partial<InviteList>>({});
const userIsTeamOwner = ref(false);
const message = ref('');
const timerId = ref();
const showOK = ref(false);
const showERROR = ref(false);
const showCheckDenyingTeamModal = ref(false);
const showCheckAcceptingTeamModal = ref(false);
const ideaGotTeam = ref(false);
const ideaSearchText = ref('');
const invitesSearchText = ref('');
const sendingInviteSearchText = ref('');
const showTechStack = ref(false);
const technologySearchText = ref('');
const selectedStack = ref<string[]>([]);


const techStack = ref({
'languages': [
    { name: 'Python', selected: false },
    { name: 'JavaScript', selected: false },
    { name: 'TypeScript', selected: false },
    { name: 'Java', selected: false },
    { name: 'C#', selected: false },
    { name: 'C++', selected: false },
    { name: 'C', selected: false },
    { name: 'PHP', selected: false },
    { name: 'Swift', selected: false },
    { name: 'Kotlin', selected: false },
    { name: 'GOLANG', selected: false },
    { name: 'Rust', selected: false },
    { name: 'Ruby', selected: false },
    { name: 'HTML', selected: false },
    { name: 'CSS', selected: false },
    { name: 'Dart', selected: false },
    { name: 'Scala', selected: false },
    { name: 'Lua', selected: false },
    { name: 'R', selected: false },
    { name: 'Groovy', selected: false },
    { name: 'Objective-C', selected: false },
    { name: 'Assembly', selected: false },
    { name: 'Delphi', selected: false },
    { name: 'Pascal', selected: false },
    { name: 'Visual Basic .NET', selected: false },
    { name: 'Elixir', selected: false },
    { name: 'Haskell', selected: false },
    { name: 'Fortran', selected: false },
    { name: 'COBOL', selected: false },
    { name: 'MATLAB', selected: false },
    { name: 'Ada', selected: false },
    { name: 'Lisp', selected: false },
    { name: 'Scheme', selected: false },
    { name: 'Julia', selected: false },
    { name: 'Erlang', selected: false },
    { name: 'Scratch', selected: false },
    { name: 'Prolog', selected: false },
    { name: 'Clojure', selected: false },
    { name: 'Blueprint', selected: false },
    { name: 'Objective-J', selected: false }
],
'frameworks': [
    { name: 'React', selected: false },
    { name: 'Vue', selected: false },
    { name: 'Angular', selected: false },
    { name: 'Next.js', selected: false },
    { name: 'Express.js', selected: false },
    { name: 'NestJS', selected: false },
    { name: 'Svelte', selected: false },
    { name: 'Django', selected: false },
    { name: 'Flask', selected: false },
    { name: 'FastAPI', selected: false },
    { name: 'Laravel', selected: false },
    { name: 'Symfony', selected: false },
    { name: 'CodeIgniter', selected: false },
    { name: 'Spring Boot', selected: false },
    { name: 'Spring MVC', selected: false },
    { name: 'ASP.NET Core', selected: false },
    { name: 'Gin', selected: false },
    { name: 'Echo', selected: false },
    { name: 'SwiftUI', selected: false },
    { name: 'UIKit', selected: false },
    { name: 'Flutter', selected: false },
    { name: 'Ember.js', selected: false },
    { name: 'Backbone.js', selected: false },
    { name: 'Meteor', selected: false },
    { name: 'AdonisJS', selected: false },
    { name: 'Nuxt.js', selected: false },
    { name: 'Remix', selected: false },
    { name: 'Phoenix', selected: false },
    { name: 'Sinatra', selected: false },
    { name: 'Koa.js', selected: false },
    { name: 'Dropwizard', selected: false },
    { name: 'Yii', selected: false },
    { name: 'CakePHP', selected: false },
    { name: 'GraphQL Yoga', selected: false }
],
'databases': [
    { name: 'PostgreSQL', selected: false },
    { name: 'MySQL', selected: false },
    { name: 'MongoDB', selected: false },
    { name: 'Redis', selected: false },
    { name: 'Microsoft SQL Server', selected: false },
    { name: 'SQLite', selected: false },
    { name: 'Oracle', selected: false },
    { name: 'MariaDB', selected: false },
    { name: 'DynamoDB', selected: false },
    { name: 'Cassandra', selected: false },
    { name: 'Cloud Firestore', selected: false },
    { name: 'Couchbase', selected: false },
    { name: 'InfluxDB', selected: false },
    { name: 'ArangoDB', selected: false },
    { name: 'Neo4j', selected: false },
    { name: 'Amazon Aurora', selected: false },
    { name: 'Memcached', selected: false },
    { name: 'IBM Db2', selected: false },
    { name: 'RethinkDB', selected: false },
    { name: 'Cosmos DB', selected: false },
    { name: 'Elasticsearch', selected: false },
    { name: 'ClickHouse', selected: false },
    { name: 'HBase', selected: false },
    { name: 'RavenDB', selected: false },
    { name: 'ObjectDB', selected: false },
    { name: 'OrientDB', selected: false },
    { name: 'Percona Server', selected: false },
    { name: 'TiDB', selected: false },
    { name: 'Greenplum', selected: false }
],
'devops': [
    { name: 'Git', selected: false },
    { name: 'Docker', selected: false },
    { name: 'Kubernetes', selected: false },
    { name: 'CI/CD', selected: false },
    { name: 'Terraform', selected: false },
    { name: 'Jenkins', selected: false },
    { name: 'Ansible', selected: false },
    { name: 'AWS CloudFormation', selected: false },
    { name: 'Azure DevOps', selected: false },
    { name: 'Google Cloud Build', selected: false },
    { name: 'Chef', selected: false },
    { name: 'Puppet', selected: false },
    { name: 'Prometheus', selected: false },
    { name: 'Grafana', selected: false },
    { name: 'Nagios', selected: false },
    { name: 'Consul', selected: false },
    { name: 'Vault', selected: false },
    { name: 'Splunk', selected: false },
    { name: 'PagerDuty', selected: false },
    { name: 'New Relic', selected: false },
    { name: 'Datadog', selected: false },
    { name: 'Sentry', selected: false },
    { name: 'Sumo Logic', selected: false },
    { name: 'CloudWatch', selected: false },
    { name: 'Azure Monitor', selected: false },
    { name: 'Google Cloud Monitoring', selected: false },
    { name: 'JFrog Artifactory', selected: false },
    { name: 'Nexus Repository', selected: false },
    { name: 'SonarQube', selected: false }
]
});

async function isUserTeamOwner() {
  const tempSession = localStorage.getItem('ttm-session')
  if (!tempSession) {
    return false;
  }
  const parsedSession = JSON.parse(tempSession);

  if (!parsedSession) {
    console.error('Ошибка при получении информации о сессии');
    return false;
  }

  console.log(parsedSession.roles);

  userIsTeamOwner.value = parsedSession.roles.includes('teamowner');
}

isUserTeamOwner();

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

.languages-background {
  background-image: url('../assets/background_languages.png');
}

.frameworks-background {
  background-image: url('../assets/background_frameworks.png');
}

.databases-background {
  background-image: url('../assets/background_databases.png');
}

.devops-background {
  background-image: url('../assets/background_DevOps.png');
}

.word-background {
  padding: 2px 30px;
  color: black;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  font-size: 16px;
}

.tech-category {
  margin-bottom: 20px;
}

.tech-category h3 {
  margin-bottom: 10px;
  color: var(--main-color);
}

.tech-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-stack-dialog {
  min-width: 400px;
  max-width: 600px;
}

.header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.search-input {
  border-radius: 20px;
}

.status-ok-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(9, 138, 9, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 10000;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  font-size: 16px;
}

.status-ok-message.hidden {
  opacity: 0;
}

.status-error-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(233, 11, 11, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 10001;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  font-size: 16px;
}

.status-error-message.hidden {
  opacity: 0;
}

.two-columns-grid {
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
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
    word-break: break-all;
    word-wrap: break-word;
    overflow: hidden;
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