export function gameService(socket, $q) {
    const deferred = $q.defer();

    socket.once('fetch-users-ids', (usersIds) => {
        deferred.resolve(usersIds);
    });

    return deferred.promise;
}
