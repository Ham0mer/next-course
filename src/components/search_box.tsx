import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  RiLoader2Line,
  RiSendPlaneLine,
  RiSearchLine,
  RiHistoryLine,
  RiUserLine,
} from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, isEnter } from "@/lib/utils";
import { listHistory, HistoryItem } from "@/lib/history";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";

// 用户名验证模式
const queryPatterns = {
  phone: /^1[3-9]\d{9}$/, // 中国手机号
  username: /^[a-zA-Z0-9_-]{3,20}$/, // 用户名格式
};

interface SearchBoxProps {
  initialValue?: string;
  onSearch: (value: string) => void;
  loading?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBox({
  initialValue = "",
  onSearch,
  loading = false,
  className,
  autoFocus = false,
}: SearchBoxProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHistory(listHistory().slice(0, 10));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const value = inputValue.trim();
    
    // 检测是否是手机号
    setIsPhoneNumber(queryPatterns.phone.test(value));

    // 生成建议（但不自动显示）
    if (value) {
      const historySuggestions = history
        .filter((item) =>
          item.query.toLowerCase().includes(value.toLowerCase())
        )
        .map((item) => item.query)
        .slice(0, 5);

      setSuggestions(historySuggestions);
      // 不自动显示建议，只有在 handleFocus 或用户输入时才显示
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedIndex(-1);
    // 用户输入时才显示建议
    if (e.target.value.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearch = (value?: string) => {
    const searchValue = (value || inputValue).trim();
    if (searchValue && !loading) {
      onSearch(searchValue);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEnter(e)) {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSearch(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSearch(suggestion);
  };

  const handleFocus = () => {
    if (inputValue && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="输入手机号或用户名查询学习通课程..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            disabled={loading}
            className="pl-10 pr-4 h-12 text-base"
          />
          {mounted && inputValue && (
            <Badge
              variant="secondary"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <RiUserLine className="w-3 h-3 mr-1" />
              {isPhoneNumber ? "手机号" : "用户名"}
            </Badge>
          )}
        </div>
        <Button
          onClick={() => handleSearch()}
          disabled={loading || !inputValue.trim()}
          size="lg"
          className="h-12 px-6"
        >
          {loading ? (
            <>
              <RiLoader2Line className="w-5 h-5 mr-2 animate-spin" />
              查询中...
            </>
          ) : (
            <>
              <RiSendPlaneLine className="w-5 h-5 mr-2" />
              查询
            </>
          )}
        </Button>
      </div>

      {/* 建议列表 */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg overflow-hidden"
          >
            <div className="py-2">
              <div className="px-3 py-1 text-xs text-muted-foreground flex items-center gap-1">
                <RiHistoryLine className="w-3 h-3" />
                历史记录
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors flex items-center gap-3",
                    selectedIndex === index && "bg-muted/80"
                  )}
                >
                  <RiUserLine className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1">{suggestion}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
