export const canEditPublication = (user, publication) => {
    if (!user || !publication) return false;
    
    if (user.role === 'ADMIN') return true;
    
    const publicationUserId = publication.user?.uid || publication.user?._id;
    const currentUserId = user.uid || user._id;
    
    return publicationUserId === currentUserId;
};

export const canDeletePublication = (user, publication) => {
    if (!user || !publication) return false;
    
    if (user.role === 'ADMIN') return true;
    
    const publicationUserId = publication.user?.uid || publication.user?._id;
    const currentUserId = user.uid || user._id;
    
    return publicationUserId === currentUserId;
};

export const canViewPublication = (user, publication) => {
    if (!publication) return false;
    
    if (!user) {
        return publication.visibility === 'public' || !publication.visibility;
    }
    
    if (user.role === 'ADMIN') return true;
    
    if (publication.visibility === 'public' || !publication.visibility) return true;
    
    if (publication.visibility === 'private') {
        const publicationUserId = publication.user?.uid || publication.user?._id;
        const currentUserId = user.uid || user._id;
        return publicationUserId === currentUserId;
    }
    
    return false;
};

export const getPublicationPermissions = (user, publication) => {
    return {
        canView: canViewPublication(user, publication),
        canEdit: canEditPublication(user, publication),
        canDelete: canDeletePublication(user, publication),
        canReact: canViewPublication(user, publication),
        canComment: canViewPublication(user, publication)
    };
};
