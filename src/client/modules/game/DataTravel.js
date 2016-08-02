export const gameService = {
    users: null,

    fetchUsersIds(socket) {
        socket.on('fetch-users-ids', (usersIds) => {
            this.users = usersIds;
            console.log(this.users, 'this.users');
        });
    }
};
