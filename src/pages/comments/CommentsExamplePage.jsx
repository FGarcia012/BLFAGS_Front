import React from 'react';
import { CommentsRefreshProvider } from '../../contexts/CommentsRefreshContext';
import PublicationWithComments from '../../components/publications/PublicationWithComments';
import { CommentsList } from '../../components/comments';
import './CommentsExamplePage.css';

const CommentsExamplePage = () => {
    const examplePublication = {
        pid: '64a1234567890abcdef12345',
        title: 'Mi primera publicación con comentarios',
        description: 'Esta es una publicación de ejemplo que muestra cómo funcionan los comentarios en la aplicación.',
        media: null,
        visibility: 'public',
        createdAt: new Date().toISOString(),
        user: {
            uid: 'user123',
            username: 'usuario_ejemplo',
            profilePicture: '/default-avatar.png'
        },
        hashtags: [
            { _id: 'hashtag1', name: 'ejemplo' },
            { _id: 'hashtag2', name: 'comentarios' }
        ],
        reactionCount: {
            total: 5
        }
    };

    return (
        <CommentsRefreshProvider>
            <div className="comments-example-page">
                <div className="page-header">
                    <h1>Ejemplo de Comentarios</h1>
                    <p>Esta página demuestra cómo implementar comentarios en publicaciones</p>
                </div>

                <div className="examples-container">
                    {/* Ejemplo 1: Publicación completa con comentarios integrados */}
                    <section className="example-section">
                        <h2>1. Publicación con Comentarios Integrados</h2>
                        <p>Muestra una publicación completa con la opción de ver/ocultar comentarios:</p>
                        
                        <div className="example-content">
                            <PublicationWithComments 
                                publication={examplePublication}
                                showCommentsInitially={false}
                            />
                        </div>
                    </section>

                    {/* Ejemplo 2: Solo sección de comentarios */}
                    <section className="example-section">
                        <h2>2. Sección de Comentarios Independiente</h2>
                        <p>Muestra solo la sección de comentarios para una publicación específica:</p>
                        
                        <div className="example-content">
                            <div className="comments-standalone">
                                <CommentsList 
                                    publicationId={examplePublication.pid}
                                    showAddComment={true}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Información de uso */}
                    <section className="usage-info">
                        <h2>Cómo Usar los Componentes de Comentarios</h2>
                        
                        <div className="usage-examples">
                            <div className="usage-example">
                                <h3>CommentsList</h3>
                                <pre className="code-example">
{`import { CommentsList } from '../components/comments';

<CommentsList 
    publicationId="publicationId"
    showAddComment={true}
/>`}
                                </pre>
                                <p>Muestra la lista completa de comentarios con opción de agregar nuevos.</p>
                            </div>

                            <div className="usage-example">
                                <h3>CommentsToggle</h3>
                                <pre className="code-example">
{`import { CommentsToggle } from '../components/comments';

<CommentsToggle 
    publicationId="publicationId"
    onToggle={(isVisible) => setShowComments(isVisible)}
    showCount={true}
/>`}
                                </pre>
                                <p>Botón para mostrar/ocultar comentarios con contador.</p>
                            </div>

                            <div className="usage-example">
                                <h3>Hook useComments</h3>
                                <pre className="code-example">
{`import { useComments } from '../shared/hooks/useComments';

const { 
    comments, 
    loading, 
    addComment, 
    removeComment,
    commentsCount 
} = useComments(publicationId);`}
                                </pre>
                                <p>Hook para manejar el estado y las acciones de comentarios.</p>
                            </div>

                            <div className="usage-example">
                                <h3>Contexto CommentsRefresh</h3>
                                <pre className="code-example">
{`import { CommentsRefreshProvider } from '../contexts/CommentsRefreshContext';

<CommentsRefreshProvider>
    {/* Tu aplicación */}
</CommentsRefreshProvider>`}
                                </pre>
                                <p>Envuelve tu aplicación para manejar actualizaciones globales de comentarios.</p>
                            </div>
                        </div>
                    </section>

                    {/* API endpoints */}
                    <section className="api-info">
                        <h2>Endpoints de API Utilizados</h2>
                        
                        <div className="api-endpoints">
                            <div className="endpoint">
                                <strong>GET</strong> <code>/comment/publication/{`{pid}`}</code>
                                <p>Obtiene todos los comentarios de una publicación</p>
                            </div>
                            
                            <div className="endpoint">
                                <strong>POST</strong> <code>/comment/addComment</code>
                                <p>Agrega un nuevo comentario (con texto y/o media)</p>
                            </div>
                            
                            <div className="endpoint">
                                <strong>DELETE</strong> <code>/comment/deleteComment/{`{cid}`}</code>
                                <p>Elimina un comentario (solo el autor o admin)</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </CommentsRefreshProvider>
    );
};

export default CommentsExamplePage;
