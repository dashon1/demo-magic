import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DemoComment, User } from "@/api/entities";
import { MessageSquare, Send, Check, X } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function CollaborationPanel({ demoId, selectedScreen }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await DemoComment.filter({ demo_id: demoId }, "-created_date");
        setComments(data);
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };

    const loadUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    if (demoId) {
      loadComments();
      loadUser();
    }
  }, [demoId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await DemoComment.create({
        demo_id: demoId,
        screen_id: selectedScreen?.id,
        content: newComment
      });

      const updatedComments = await DemoComment.filter({ demo_id: demoId }, "-created_date");
      setComments(updatedComments);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
    setIsSubmitting(false);
  };

  const toggleResolve = async (comment) => {
    try {
      await DemoComment.update(comment.id, { resolved: !comment.resolved });
      const updatedComments = await DemoComment.filter({ demo_id: demoId }, "-created_date");
      setComments(updatedComments);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const screenComments = selectedScreen 
    ? comments.filter(c => c.screen_id === selectedScreen.id)
    : comments;

  if (!demoId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">
            Save your demo to enable collaboration
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Comments & Feedback
          <Badge variant="outline" className="ml-auto text-xs">
            {screenComments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Leave a comment or feedback..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="text-sm"
          />
          <Button 
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
            size="sm"
            className="w-full"
          >
            <Send className="w-3 h-3 mr-2" />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {screenComments.length === 0 ? (
              <div className="text-center py-6">
                <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                  No comments yet{selectedScreen ? ' on this screen' : ''}
                </p>
              </div>
            ) : (
              screenComments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 border rounded-lg ${
                    comment.resolved 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {comment.created_by}
                      </p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(comment.created_date), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleResolve(comment)}
                      className="h-6"
                    >
                      {comment.resolved ? (
                        <>
                          <X className="w-3 h-3 mr-1" />
                          <span className="text-xs">Reopen</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          <span className="text-xs">Resolve</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-slate-700">{comment.content}</p>
                  {comment.resolved && (
                    <Badge variant="outline" className="mt-2 text-xs bg-green-100 text-green-800 border-green-300">
                      Resolved
                    </Badge>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}