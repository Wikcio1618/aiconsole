// The AIConsole Project
//
// Copyright 2023 10Clouds
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { ChatHeadline } from '@/types/types';
import { cn } from '@/utils/styles';
import { Trash, Pencil, Check, X } from 'lucide-react';

export type HeadlinesGroupProps = {
  title: string;
  headlines: ChatHeadline[];
  currentChatId: string;
  onChatDelete: (e: React.MouseEvent, id: string) => void;
  onHeadlineChange: (chatId: string, newHeadline: string) => void;
};

const HeadlinesGroup = ({
  title,
  headlines,
  currentChatId,
  onChatDelete,
  onHeadlineChange,
}: HeadlinesGroupProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputText, setInputText] = useState('');

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget === closeButtonRef.current) {
      disableEditMode();
    } else {
      onAccept(currentChatId);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAccept(currentChatId);
    } else if (e.key === 'Escape') {
      disableEditMode();
    }
  }

  const handleLinkClick = (chatId: string) => {
    if (chatId !== currentChatId && isEditMode) {
      disableEditMode();
    }
  };

  const disableEditMode = () => {
    setIsEditMode(false);
    setInputText('');
  }

  const onChatEdit = (message: string) => {
    setIsEditMode(true);
    setInputText(message);
  };

  const onAccept = (chatId: string) => {
    onHeadlineChange(chatId, inputText);
    setIsEditMode(false);
  };

  return (
    <>
      <h3 className="uppercase px-6 py-2 text-gray-400 text-xs leading-5">
        {title}
      </h3>
      {headlines.map((chat) => {
        const selected = chat.id == currentChatId;

        return (
          <Link
            to={`/chats/${chat.id}`}
            onClick={() => handleLinkClick(chat.id)}
            className={cn(
              ' hover:bg-white/5 px-6 h-full py-3 cursor-pointer flex flex-row gap-3 items-center text-base text-gray-300 leading-[27px]',
              selected ? 'bg-white/5 font-bold text-white' : '',
            )}
            title={chat.message}
            key={chat.id}
          >
            {isEditMode && selected ? (
              <div className="flex gap-2 w-full">
                <input
                  className="font-normal outline-1 outline-white/20 ring-secondary/30 bg-black resize-none overflow-hidden rounded-lg outline focus:outline-none focus:ring-2"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex-grow flex items-center gap-2">
                  <button>
                    <Check
                      className="h-4 w-4"
                      onClick={() => onAccept(chat.id)}
                    />
                  </button>
                  <button onClick={() => setIsEditMode(false)} ref={closeButtonRef} >
                    <X className="h-4 w-4"/>
                  </button>
                </div>
              </div>
            ) : (
              <div className="truncate flex-grow">{chat.message}</div>
            )}
            {selected && !isEditMode && (
              <>
                <Pencil
                  className="h-4 w-4 flex-none"
                  onClick={() => onChatEdit(chat.message)}
                />
                <Trash
                  className="h-4 w-4 flex-none"
                  onClick={(e) => onChatDelete(e, chat.id)}
                />
              </>
            )}
          </Link>
        );
      })}
    </>
  );
};
export default HeadlinesGroup;
