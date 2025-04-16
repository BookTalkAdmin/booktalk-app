import React, { useRef, useEffect, useState } from 'react';
import { MessageCircle, Share2, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookTag from './BookTag';

const VideoCard = ({ video, onBookmarkToggle }) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(video.comments || []);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5
      }
    );

    const currentVideo = videoRef.current;
    if (currentVideo) {
      observer.observe(currentVideo);
    }

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo);
      }
    };
  }, []);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (currentVideo) {
      if (isVisible) {
        currentVideo.play().catch(() => {
          // Handle autoplay error (e.g., browser blocking autoplay)
          console.log('Autoplay was prevented');
        });
        setIsPlaying(true);
      } else {
        currentVideo.pause();
        setIsPlaying(false);
      }
    }
  }, [isVisible]);

  const handleVideoClick = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play().catch(() => {
        console.log('Play was prevented');
      });
      setIsPlaying(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4"
    >
      <div className="relative">
        <div className="relative aspect-[9/16] bg-black" onClick={handleVideoClick}>
          <video
            ref={videoRef}
            src={video.thumbnail}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted
            playsInline
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
              </div>
            </div>
          )}
        </div>
        
        {/* Featured Books Tags */}
        {video.featuredBooks && video.featuredBooks.length > 0 && (
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 max-w-[80%]">
            {video.featuredBooks.map((featured) => (
              <BookTag
                key={featured.book._id}
                book={featured.book}
                timestamp={featured.timestamp}
                note={featured.note}
              />
            ))}
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              onBookmarkToggle?.();
            }}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark
              size={18}
              className={isBookmarked ? "text-[#5D4037] fill-[#5D4037]" : "text-gray-700"}
            />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComments(prev => !prev)}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            aria-label="Show comments"
          >
            <MessageCircle size={18} className="text-gray-700" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            aria-label="Share video"
          >
            <Share2 size={18} className="text-gray-700" />
          </motion.button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{video.title}</h3>
        <p className="text-sm text-gray-600">{video.creator}</p>
        
        {/* Video Stats */}
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <span>{video.views} views</span>
          <span>•</span>
          <span>{video.comments?.length || 0} comments</span>
          <span>•</span>
          <span>{video.featuredBooks?.length || 0} books mentioned</span>
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {video.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Description Toggle */}
        <button
          onClick={() => setShowDescription(prev => !prev)}
          className="mt-3 flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showDescription ? (
            <>
              <ChevronUp size={16} />
              <span>Show less</span>
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              <span>Show more</span>
            </>
          )}
        </button>

        {/* Description */}
        <AnimatePresence>
          {showDescription && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="mt-3 text-sm text-gray-600">{video.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <h4 className="font-medium text-gray-800">Comments</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037] min-h-[80px] resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (comment.trim()) {
                      setComments([
                        ...comments,
                        {
                          id: Date.now(),
                          text: comment,
                          user: 'You',
                          timestamp: new Date().toISOString()
                        }
                      ]);
                      setComment('');
                    }
                  }}
                  disabled={!comment.trim()}
                  className="px-4 py-2 bg-[#5D4037] text-white rounded-lg text-sm hover:bg-[#4A332C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Post Comment
                </motion.button>
                <p className="text-center text-sm text-gray-500 py-4">No comments yet</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoCard;
