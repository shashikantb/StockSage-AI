'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStockSearchSuggestions } from '@/ai/flows/stock-search-suggestions';
import { getPromptSuggestions } from '@/ai/flows/prompt-engineering-assistance';
import { aiStockAnalysis, type AiStockAnalysisOutput } from '@/ai/flows/ai-stock-analysis';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons/logo';
import { StockChart } from '@/components/StockChart';
import { Lightbulb, Search, TrendingDown, TrendingUp, LineChart, Target, BookOpen, Calculator, Combine, Star, Landmark, Component } from 'lucide-react';

type LoadingState = {
  search: boolean;
  analysis: boolean;
  prompts: boolean;
};

type Signal = 'Buy' | 'Sell' | 'Hold';
type SignalTheme = {
  [key in Signal]: {
    Icon: React.ElementType;
    badgeClass: string;
  };
};

const signalThemes: SignalTheme = {
  Buy: { Icon: TrendingUp, badgeClass: 'bg-green-500/20 text-green-700 border-green-500/50 hover:bg-green-500/30' },
  Sell: { Icon: TrendingDown, badgeClass: 'bg-red-500/20 text-red-700 border-red-500/50 hover:bg-red-500/30' },
  Hold: { Icon: LineChart, badgeClass: 'bg-gray-500/20 text-gray-700 border-gray-500/50 hover:bg-gray-500/30' },
};

const strategyIcons: { [key: string]: React.ElementType } = {
  'Technical Analysis–Based Strategies': Target,
  'Fundamental Analysis–Based Strategies': BookOpen,
  'Quantitative / Data-Driven Strategies': Calculator,
  'Hybrid Strategies (Tech + Fundamentals)': Combine,
  'Extra Features for Analysis Portal': Star,
  'Institutional Trade Spotting': Landmark,
};


function getSignalFromColor(colorCode: string): Signal {
  const lowerColor = colorCode.toLowerCase();
  if (lowerColor.includes('green') || lowerColor.includes('teal') || lowerColor.includes('lime')) {
    return 'Buy';
  }
  if (lowerColor.includes('red') || lowerColor.includes('orange') || lowerColor.includes('maroon')) {
    return 'Sell';
  }
  return 'Hold';
}

function getStatusColorClass(colorCode: string): string {
    const lowerColor = colorCode.toLowerCase();
    if (lowerColor.includes('green')) return 'bg-green-500';
    if (lowerColor.includes('red')) return 'bg-red-500';
    return 'bg-gray-500';
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AiStockAnalysisOutput | null>(null);
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ search: false, analysis: false, prompts: false });

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value.length === 0) {
      setAnalysisResult(null);
      setSelectedStock(null);
      setSuggestions([]);
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.length > 1) {
      setLoading(prev => ({ ...prev, search: true }));
      debounceTimeout.current = setTimeout(async () => {
        try {
          const result = await getStockSearchSuggestions({ searchTerm: value });
          setSuggestions(result.suggestions || []);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch search suggestions.' });
          setSuggestions([]);
        } finally {
          setLoading(prev => ({ ...prev, search: false }));
        }
      }, 300);
    } else {
      setSuggestions([]);
    }
  }, [toast]);

  const handleSelectStock = useCallback(async (stockTicker: string, prompt?: string) => {
    setLoading({ search: false, analysis: true, prompts: true });
    setSearchTerm(stockTicker);
    setSelectedStock(stockTicker);
    setSuggestions([]);
    setAnalysisResult(null);

    try {
      const [analysis, prompts] = await Promise.all([
        aiStockAnalysis({ ticker: stockTicker }),
        getPromptSuggestions({ stockSegment: 'Technology' }) // Segment is mocked for now
      ]);

      setAnalysisResult(analysis);
      setPromptSuggestions(prompts.suggestions || []);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not perform AI analysis for this stock.' });
      setAnalysisResult(null);
      setPromptSuggestions([]);
    } finally {
      setLoading(prev => ({ ...prev, analysis: false, prompts: false }));
    }
  }, [toast]);

  const signal = analysisResult ? getSignalFromColor(analysisResult.overallColorCode) : null;
  const theme = signal ? signalThemes[signal] : null;

  return (
    <main className="container mx-auto p-4 md:p-8 flex flex-col items-center min-h-screen">
      <header className="flex items-center gap-3 mb-8">
        <Logo className="h-10 w-10 text-primary" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">
          StockSage AI
        </h1>
      </header>

      <div className="w-full max-w-2xl mb-8 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a stock (e.g., 'AAPL', 'GOOGL')"
            className="w-full pl-10 pr-4 py-6 text-lg rounded-full shadow-lg"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-xl z-10"
            >
              <ul>
                {suggestions.map((s, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleSelectStock(s)}
                      className="w-full text-left px-4 py-3 hover:bg-accent transition-colors duration-200"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(loading.analysis || analysisResult) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl space-y-8 mt-4"
          >
            {/* Main analysis and chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="overflow-hidden shadow-xl" style={analysisResult ? { borderColor: analysisResult.overallColorCode, borderWidth: '2px' } : {}}>
                  <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center justify-between">
                      {selectedStock ? `Analysis for ${selectedStock}` : 'Analysis'}
                      {loading.analysis ? <Skeleton className="h-8 w-24" /> : theme && (
                        <Badge variant="outline" className={`text-base px-4 py-2 rounded-full ${theme.badgeClass}`}>
                          <theme.Icon className="h-5 w-5 mr-2" />
                          {signal}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.analysis ? (
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    ) : (
                      <p className="text-lg leading-relaxed">{analysisResult?.overallAnalysis}</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">Performance Chart</CardTitle>
                    <CardDescription>Demonstration chart with placeholder data for {selectedStock}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading.analysis ? (
                       <div className="w-full h-[300px] flex items-center justify-center">
                          <Skeleton className="w-full h-full"/>
                       </div>
                    ) : selectedStock && <StockChart ticker={selectedStock} />}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center">
                      <Lightbulb className="h-6 w-6 mr-2 text-primary" />
                      Prompt Ideas
                    </CardTitle>
                    <CardDescription>Use these AI-generated prompts for a deeper dive.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {loading.prompts ? (
                        <>
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </>
                      ) : (
                        promptSuggestions.map((prompt, i) => (
                          <Button key={i} variant="ghost" className="w-full justify-start text-left h-auto py-2" onClick={() => handleSelectStock(selectedStock!, prompt)}>
                            {prompt}
                          </Button>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Strategy sections */}
            <div>
              <h2 className="text-3xl font-headline font-bold text-primary mb-6 text-center">
                Stock Analysis Strategies
              </h2>
              {loading.analysis ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, index) => (
                           <Card key={index} className="shadow-lg">
                               <CardHeader>
                                   <Skeleton className="h-6 w-3/4" />
                               </CardHeader>
                               <CardContent>
                                   <Skeleton className="h-4 w-full" />
                                   <Skeleton className="h-4 w-full mt-2" />
                                   <Skeleton className="h-4 w-2/3 mt-2" />
                               </CardContent>
                           </Card>
                      ))}
                  </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysisResult?.strategies?.map((section, index) => {
                    const Icon = strategyIcons[section.title] || Star;
                    return (
                      <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                         <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColorClass(section.colorCode)} flex-shrink-0`}></div>
                          <div className="flex items-center gap-2">
                            <Icon className="h-6 w-6 text-primary" />
                            <CardTitle className="font-headline text-xl">{section.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-muted-foreground">{section.content}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
