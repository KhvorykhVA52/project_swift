import { api } from './axios';
import { UpdateCommentDto } from '../../../backend/src/comments/dto/update-comment.dto';
import { CreateCommentDto } from '../../../backend/src/comments/dto/create-comment.dto';
import { CreateIdeaDto } from '../../../backend/src/idea/dto/create-idea.dto';

export async function getAll2() {
    const response = await api.get('ideas/getall2');

    if (response.status == 200) {
        return response.data;
    }

    return null;
}

export async function getBy(id: number) {
    const response = await api.get('ideas/getby/' + id);

    if (response.status == 200) {
        return response.data;
    }

    return null;
}

export async function editComment(id: number, updateCommentDto: UpdateCommentDto) {
    const response = await api.put('comments/edit/' + id, updateCommentDto);

    if (response.status == 200) {
        return response.data;
    }

    return null;
}

export async function createComment(createCommentDto: CreateCommentDto) {
    const response = await api.post('comments/', createCommentDto);

    if (response.status == 201) {
        return response.data;
    }

    return null;
}

export async function deleteComment(id: number) {
    const response = await api.delete('comments/delete/' + id);

    if (response.status == 200) {
        return response.data;
    }

    return null;
}

export async function createIdea(createIdeaDto: CreateIdeaDto) {
    const response = await api.post('ideas/create/', createIdeaDto);

    if (response.status == 201) {
        return response.data;
    }

    return null;
}

export async function deleteIdea(id: number) {
    const response = await api.post('ideas/delete/', {id: id});

    if (response.status == 201) {
        return response.data;
    }

    return null;
}

export async function editIdeaname(id: number, data: string) {
    const response = await api.post('ideas/changename', {id: id, data: data});

    if (response.status == 201) {
        return response.data;
    }

    return null;
}

export async function editIdeaproblem(id: number, data: string) {
    const response = await api.post('ideas/changeproblem', {id: id, data: data});

    if (response.status == 201) {
        return response.data;
    }

    return null;
}

export async function editIdeasolution(id: number, data: string) {
    const response = await api.post('ideas/changesolution', {id: id, data: data});

    if (response.status == 201) {
        return response.data;
    }

    return null;
}

export async function editIdearesult(id: number, data: string) {
    const response = await api.post('ideas/changeresult', {id: id, data: data});

    if (response.status == 201) {
        return response.data;
    }

    return null;
}

export async function editIdearesource(id: number, data: string) {
    const response = await api.post('ideas/changeresource', {id: id, data: data});

    if (response.status == 201) {
        return response.data;
    }

    return null;
}

/*
export async function editIdeastatus(id: number, data: string) {
    const response = await api.post('ideas/change', {id: id, data: data});

    if (response.status == 201) {
        return response.data;
    }

    return null;
}
*/

export async function editIdeacustomer(id: number, customerId: number) {
    const response = await api.post('ideas/changecustomer', {id: id, data: customerId});

    if (response.status == 201) {
        return response.data;
    }

    return null;
}