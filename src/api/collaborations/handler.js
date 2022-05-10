const ClientError = require('../../exceptions/clientError');

class collaborationsHandler {
    constructor(service, validator) {
        const { collaborationsService, playlistsService, usersService } = service;
        this._service = collaborationsService;
        this._playlistsService = playlistsService;
        this._usersService = usersService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            //  Check the playlist and user id
            const { playlistId, userId } = request.payload;
            await this._playlistsService.getPlaylistsById(playlistId);
            //  Check user owning the playlist
            await this._usersService.getUserById(userId);
            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            const collaborationId = await this._service.addCollaboration(playlistId, userId);
            const response = h.response({
                status: 'success',
                message: 'Kolaborasi berhasil ditambahkan',
                data: { collaborationId },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            //  Server error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan di server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;
            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            await this._service.deleteCollaboration(playlistId, userId);
            return {
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            //  Server error
            const response = h.response({
                status: 'error',
                message: 'Maaf terjadi kegagalan di server kami',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = collaborationsHandler;
