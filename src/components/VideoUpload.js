import React, { useState, useRef, useCallback, useEffect } from 'react';
import api from '../services/api';
import Webcam from 'react-webcam';
import Select from 'react-select';
import { WithContext as ReactTags } from 'react-tag-input';
import { searchBooks } from '../services/bookService';
import { X, Play, Pause, RotateCcw, Check, Video, Upload, Plus } from 'lucide-react';
import { useTBR } from '../contexts/TBRContext';

const VideoUpload = () => {
  const [mode, setMode] = useState('initial');
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const { addToTBR } = useTBR();

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleStartRecording = useCallback(async () => {
    try {
      if (!webcamRef.current?.stream) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        webcamRef.current.video.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setError(null);

      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 300) {
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check your camera and microphone permissions.');
    }
  }, [webcamRef]);

  const handleStopRecording = useCallback(() => {
    try {
      if (!mediaRecorderRef.current) return;

      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setMode('preview');
      setError(null);

      // Clean up media stream
      const tracks = webcamRef.current?.stream?.getTracks();
      tracks?.forEach(track => track.stop());
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Failed to stop recording. Please try again.');
    }
  }, [webcamRef]);

  const handleDownload = async () => {
    if (!recordedChunks.length) return;

    try {
      setIsProcessing(true);
      setError(null);
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('video', blob, 'recording.webm');
      formData.append('title', title);
      formData.append('description', description);
      formData.append('books', JSON.stringify(selectedBooks));
      formData.append('tags', JSON.stringify(tags));

      const response = await api.post('/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setMode('success');
      }
    } catch (err) {
      console.error('Error processing video:', err);
      setError('Failed to process video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearchBooks = async (inputValue) => {
    if (!inputValue) return;
    const books = await searchBooks(inputValue);
    setBookSuggestions(books.map(book => ({
      value: book.id,
      label: `${book.title} by ${book.author}`,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      amazonLink: book.amazonLink
    })));
  };

  const handleDeleteTag = useCallback((i) => {
    setTags(tags.filter((_, index) => index !== i));
  }, [tags]);

  const handleAddTag = useCallback((tag) => {
    setTags([...tags, tag]);
  }, [tags]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        setError('Please select a video file');
        return;
      }

      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setError('Video file size must be less than 100MB');
        return;
      }

      try {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('books', JSON.stringify(selectedBooks));
        formData.append('tags', JSON.stringify(tags));

        const response = await api.post('/videos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 201) {
          setMode('success');
        }
      } catch (err) {
        console.error('Error uploading video:', err);
        setError('Failed to upload video. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const renderContent = () => {
    switch (mode) {
      case 'initial':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <button
              onClick={() => setMode('recording')}
              className="flex items-center gap-2 px-6 py-3 bg-[#6B4D3C] text-white rounded-full hover:bg-[#5D4037] transition-colors"
            >
              <Video className="w-5 h-5" />
              <span>Record Video</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 border border-[#6B4D3C] text-[#6B4D3C] rounded-full hover:bg-[#FAF7F5] transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Video</span>
            </button>
          </div>
        );

      case 'recording':
        return (
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={true}
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
              {!isRecording && recordingDuration < 60 && (
                <div className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                  Minimum 1 minute
                </div>
              )}
              {recordingDuration >= 60 && recordingDuration < 300 && (
                <div className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                  {formatDuration(recordingDuration)}
                </div>
              )}
              {recordingDuration >= 300 && (
                <div className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                  Max duration reached
                </div>
              )}
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`p-4 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-[#6B4D3C] hover:bg-[#5D4037]'
                } text-white transition-colors`}
              >
                {isRecording ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              {recordingDuration > 0 && (
                <button
                  onClick={() => {
                    setRecordedChunks([]);
                    setRecordingDuration(0);
                    setMode('initial');
                  }}
                  className="p-4 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-4">
            {recordedChunks.length > 0 && (
              <video
                className="w-full rounded-lg"
                controls
                src={URL.createObjectURL(new Blob(recordedChunks, { type: 'video/webm' }))}
              />
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setRecordedChunks([]);
                  setRecordingDuration(0);
                  setMode('recording');
                }}
                className="px-4 py-2 border border-[#6B4D3C] text-[#6B4D3C] rounded-full hover:bg-[#FAF7F5] transition-colors"
              >
                Record Again
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-[#6B4D3C] text-white rounded-full hover:bg-[#5D4037] transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        );

      case 'editing':
        return (
          <div className="space-y-6">
            {/* Video Preview */}
            {(recordedChunks.length > 0 || uploadedVideo) && (
              <div className="relative">
                <video
                  className="w-full rounded-lg"
                  controls
                  src={uploadedVideo ? URL.createObjectURL(uploadedVideo) : URL.createObjectURL(new Blob(recordedChunks, { type: 'video/webm' }))}
                />
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C] bg-white"
                  placeholder="Enter a title for your video"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C] bg-white h-24 resize-none"
                  placeholder="What's your video about?"
                />
              </div>

              {/* Book Mentions */}
              <div>
                <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                  Mentioned Books
                </label>
                <div className="space-y-2">
                  <Select
                    isMulti
                    options={bookSuggestions}
                    value={selectedBooks}
                    onChange={setSelectedBooks}
                    onInputChange={(value) => {
                      if (value) handleSearchBooks(value);
                    }}
                    placeholder="Search for books..."
                    className="text-sm"
                    noOptionsMessage={() => "Type to search for books..."}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#D4C5BE',
                        '&:hover': {
                          borderColor: '#6B4D3C'
                        }
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#FAF7F5',
                        borderRadius: '0.5rem',
                        paddingRight: '0.5rem'
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#6B4D3C'
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: '#8B7B74',
                        '&:hover': {
                          backgroundColor: '#D4C5BE',
                          color: '#6B4D3C'
                        }
                      })
                    }}
                  />
                  {selectedBooks.map(book => (
                    <div key={book.value} className="flex items-center justify-between bg-white rounded-lg border border-[#D4C5BE] p-3">
                      <div>
                        <h4 className="font-medium text-[#6B4D3C]">{book.title}</h4>
                        <p className="text-sm text-[#8B7B74]">{book.author}</p>
                      </div>
                      <button
                        onClick={() => addToTBR(book)}
                        className="p-2 text-[#6B4D3C] hover:text-[#5D4037] transition-colors"
                        title="Add to TBR"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                  Tags
                </label>
                <ReactTags
                  tags={tags}
                  handleDelete={handleDeleteTag}
                  handleAddition={handleAddTag}
                  placeholder="Add tags..."
                  classNames={{
                    tags: 'space-y-2',
                    tagInput: 'w-full',
                    tagInputField: 'w-full px-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C] bg-white',
                    tag: 'inline-flex items-center gap-1 px-3 py-1 bg-[#FAF7F5] text-[#6B4D3C] rounded-full text-sm mr-2',
                    remove: 'text-[#8B7B74] hover:text-[#6B4D3C] cursor-pointer ml-1'
                  }}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => setMode('initial')}
                  className="px-4 py-2 border border-[#6B4D3C] text-[#6B4D3C] rounded-full hover:bg-[#FAF7F5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle save as draft
                  }}
                  className="px-4 py-2 border border-[#6B4D3C] text-[#6B4D3C] rounded-full hover:bg-[#FAF7F5] transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => {
                    // Handle publish
                  }}
                  className="px-4 py-2 bg-[#6B4D3C] text-white rounded-full hover:bg-[#5D4037] transition-colors"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-[#D4C5BE] overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default VideoUpload;
