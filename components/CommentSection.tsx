'use client'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'
import {useAuthStore} from '@/firebase/AuthClient'
import {
  addComment,
  deleteComment,
  editComment,
  getComments,
  toggleCommentReaction,
} from '@/firebase/actions/comments'
import {Comment} from '@/firebase/types'
import {useTranslation} from '@/lib/i18n'
import {Button} from '@heroui/button'
import {Textarea} from '@heroui/input'
import {Popover, PopoverContent, PopoverTrigger} from '@heroui/popover'
import {addToast} from '@heroui/toast'
import {CornerDownRight, Edit2, MessageCircle, SmilePlus, Trash2, X} from 'lucide-react'
import {useEffect, useRef, useState} from 'react'

export default function CommentSection({targetId}: {targetId: string}) {
  const {t, locale} = useTranslation({...en, ...ko})
  const {user, loading} = useAuthStore()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  // Thread State
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [replyingToName, setReplyingToName] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  // Edit State
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState('')
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Reply text area reference for scrolling
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const fetchComments = async () => {
    setIsFetching(true)
    const fetched = await getComments(targetId)
    setComments(fetched)
    setIsFetching(false)
  }

  useEffect(() => {
    fetchComments()
  }, [targetId])

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return

    setIsLoading(true)
    const result = await addComment({
      targetId,
      userId: user.uid,
      userDisplayName: user.displayName || 'Anonymous',
      userPhotoURL: user.photoURL || '',
      text: newComment.trim(),
    })

    if (result.success) {
      setNewComment('')
      addToast({title: 'Success', description: t('comments.messages.added'), color: 'success'})
      await fetchComments()
    } else {
      addToast({title: 'Error', description: t('comments.messages.error'), color: 'danger'})
    }
    setIsLoading(false)
  }

  const handleReplySubmit = async () => {
    if (!user || !replyText.trim() || !replyingToId) return

    setIsLoading(true)
    const result = await addComment({
      targetId,
      userId: user.uid,
      userDisplayName: user.displayName || 'Anonymous',
      userPhotoURL: user.photoURL || '',
      text: replyText.trim(),
      parentId: replyingToId,
    })

    if (result.success) {
      setReplyText('')
      setReplyingToId(null)
      setReplyingToName(null)
      addToast({title: 'Success', description: t('comments.messages.added'), color: 'success'})
      await fetchComments()
    } else {
      addToast({title: 'Error', description: t('comments.messages.error'), color: 'danger'})
    }
    setIsLoading(false)
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm(t('comments.messages.delete_confirm'))) return

    const result = await deleteComment(commentId)
    if (result.success) {
      addToast({title: 'Deleted', description: t('comments.messages.deleted'), color: 'success'})
      setComments(comments.filter((c) => c.id !== commentId))
    }
  }

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditCommentText(comment.text)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditCommentText('')
  }

  const handleSaveEdit = async (commentId: string) => {
    if (!editCommentText.trim()) return

    const comment = comments.find((c) => c.id === commentId)
    if (comment && editCommentText.trim() === comment.text) {
      setEditingCommentId(null)
      return
    }

    setIsSavingEdit(true)
    const result = await editComment(commentId, editCommentText.trim())
    if (result.success) {
      addToast({title: 'Success', description: t('comments.messages.added'), color: 'success'}) // Reuse success toast
      setEditingCommentId(null)
      await fetchComments()
    } else {
      addToast({title: 'Error', description: t('comments.messages.error'), color: 'danger'})
    }
    setIsSavingEdit(false)
  }

  const handleReaction = async (commentId: string, emoji: string) => {
    if (!user) {
      addToast({title: 'Notice', description: t('comments.login_required'), color: 'warning'})
      return
    }

    // Optimistic UI update
    setComments((current) =>
      current.map((c) => {
        if (c.id === commentId) {
          const reactions = {...(c.reactions || {})}
          const userList = reactions[emoji] || []
          const hasReacted = userList.includes(user.uid)

          if (hasReacted) {
            reactions[emoji] = userList.filter((id) => id !== user.uid)
          } else {
            reactions[emoji] = [...userList, user.uid]
          }

          // Clean up empty reaction arrays
          if (reactions[emoji].length === 0) delete reactions[emoji]

          return {...c, reactions}
        }
        return c
      })
    )

    // Determine add/remove based on the OLD state fetched here
    const comment = comments.find((c) => c.id === commentId)
    const hasReacted = comment?.reactions?.[emoji]?.includes(user.uid) || false

    await toggleCommentReaction(commentId, user.uid, emoji, !hasReacted)
  }

  const handleReply = (commentId: string, userName: string) => {
    setReplyingToId(commentId)
    setReplyingToName(userName)
    setReplyText('') // Reset reply input when opening a new thread
  }

  const handleCancelReply = () => {
    setReplyingToId(null)
    setReplyingToName(null)
    setReplyText('')
  }

  const topLevelComments = comments.filter((c) => !c.parentId)
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId).reverse()

  const renderCommentRow = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`group flex gap-3 ${isReply ? 'mt-3 ml-10' : ''}`}>
      {comment.userPhotoURL ? (
        <img
          src={comment.userPhotoURL}
          alt={comment.userDisplayName}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="bg-default-200 text-default-500 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
          {comment.userDisplayName.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{comment.userDisplayName}</span>
          <span className="text-default-400 text-xs">
            {new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(comment.createdAt))}
            {comment.updatedAt && <span className="ml-1">{t('comments.edited')}</span>}
          </span>
        </div>
        {editingCommentId === comment.id ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editCommentText}
              onValueChange={setEditCommentText}
              variant="faded"
              minRows={2}
              className="w-full text-sm"
              classNames={{input: 'text-left'}}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                color="primary"
                isLoading={isSavingEdit}
                onPress={() => handleSaveEdit(comment.id)}>
                {t('comments.save_button')}
              </Button>
              <Button
                size="sm"
                variant="light"
                onPress={handleCancelEdit}
                isDisabled={isSavingEdit}>
                {t('comments.cancel_button')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-1 text-left text-sm whitespace-pre-wrap">{comment.text}</p>

            {/* Reactions Display */}
            {comment.reactions && Object.keys(comment.reactions).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(comment.reactions).map(([emoji, users]) => {
                  if (users.length === 0) return null
                  const hasReacted = user ? users.includes(user.uid) : false
                  return (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(comment.id, emoji)}
                      className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
                        hasReacted
                          ? 'border-primary-200 bg-primary-50 text-primary-700'
                          : 'border-default-200 bg-default-50 text-default-600 hover:bg-default-100'
                      }`}>
                      <span>{emoji}</span>
                      <span>{users.length}</span>
                    </button>
                  )
                })}
              </div>
            )}

            <div className="mt-2 flex items-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
              {user && (
                <Popover placement="top" showArrow>
                  <PopoverTrigger>
                    <button className="text-default-500 hover:text-primary flex items-center gap-1 text-xs">
                      <SmilePlus className="h-3.5 w-3.5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex gap-1 p-1">
                      {['👍', '❤️', '😄', '😢', '👏'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(comment.id, emoji)}
                          className="hover:bg-default-100 flex h-8 w-8 items-center justify-center rounded text-lg transition-transform hover:scale-110">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              {!isReply && (
                <button
                  onClick={() => handleReply(comment.id, comment.userDisplayName)}
                  className="text-default-500 hover:text-primary flex items-center gap-1 text-xs">
                  <CornerDownRight className="h-3.5 w-3.5" />
                  {t('comments.reply_button')}
                </button>
              )}
              {(user?.uid === comment.userId || user?.email === 'vancouverkdd@gmail.com') && (
                <>
                  {user?.uid === comment.userId && (
                    <button
                      onClick={() => handleEdit(comment)}
                      className="text-default-500 hover:text-primary flex items-center gap-1 text-xs">
                      <Edit2 className="h-3.5 w-3.5" />
                      {t('comments.edit_button')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-danger hover:text-danger-500 flex items-center gap-1 text-xs">
                    <Trash2 className="h-3.5 w-3.5" />
                    {t('comments.delete_button')}
                  </button>
                </>
              )}
            </div>

            {/* Inline Reply Editor */}
            {replyingToId === comment.id && !isReply && (
              <div className="bg-default-50 border-default-100 mt-4 flex w-full gap-3 rounded-xl border p-4">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Me'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-default-200 text-default-500 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                    {(user?.displayName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <div className="text-default-500 flex items-center justify-between text-sm">
                    <span>
                      Replying to{' '}
                      <span className="text-foreground font-semibold">{replyingToName}</span>...
                    </span>
                    <button
                      onClick={handleCancelReply}
                      className="text-default-400 hover:text-default-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Textarea
                    autoFocus
                    placeholder={t('comments.placeholder')}
                    minRows={2}
                    variant="faded"
                    value={replyText}
                    onValueChange={setReplyText}
                    className="w-full text-sm"
                    classNames={{input: 'text-left'}}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="light"
                      onPress={handleCancelReply}
                      isDisabled={isLoading}>
                      {t('comments.cancel_button')}
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      isLoading={isLoading}
                      isDisabled={!replyText.trim()}
                      onPress={handleReplySubmit}>
                      {t('comments.submit_button')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl pt-10">
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">{t('comments.title')}</h3>
      </div>
      <div className="border-default-200 mb-6 border-b" />

      {/* Comment List */}
      <div className="mb-6 space-y-4">
        {isFetching ? (
          <div className="text-default-400 py-4 text-center">{t('comments.loading')}</div>
        ) : topLevelComments.length === 0 ? (
          <div className="text-default-400 py-4 text-center">{t('comments.empty')}</div>
        ) : (
          topLevelComments.map((comment) => (
            <div
              key={comment.id}
              className="border-default-100 mb-4 border-b pb-4 last:mb-0 last:border-0 last:pb-0">
              {renderCommentRow(comment)}
              {getReplies(comment.id).map((reply) => renderCommentRow(reply, true))}
            </div>
          ))
        )}
      </div>

      {/* Input Section */}
      {!loading &&
        (user ? (
          <div className="flex items-start gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Me'}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="bg-default-200 text-default-500 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                {(user.displayName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 space-y-2">
              <Textarea
                ref={textareaRef}
                placeholder={t('comments.placeholder')}
                minRows={2}
                variant="faded"
                value={newComment}
                onValueChange={setNewComment}
                classNames={{input: 'text-left'}}
              />
              <div className="flex justify-start">
                <Button
                  color="default"
                  className="bg-default-100 font-medium drop-shadow-sm"
                  isLoading={isLoading}
                  isDisabled={!newComment.trim()}
                  onPress={handleSubmit}>
                  {t('comments.submit_button')}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-default-50 border-default-100 rounded-lg border p-6 text-center">
            <p className="text-default-500 mb-4">{t('comments.login_required')}</p>
          </div>
        ))}
    </div>
  )
}
