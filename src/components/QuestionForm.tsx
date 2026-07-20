import React, { useState } from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface QuestionFormProps {
  question: Question;
  onAnswer: (answer: string, isPublished: boolean) => void;
  onUpdate: (name: string, title: string, question: string) => void;
  onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onAnswer,
  onUpdate,
  onCancel,
}) => {
  const [answer, setAnswer] = useState(question.answer || '');
  const [editedName, setEditedName] = useState(question.name);
  const [editedTitle, setEditedTitle] = useState(question.title);
  const [editedQuestion, setEditedQuestion] = useState(question.question);

  return (
    <Card className="p-6 bg-coffee-900/50 border-coffee-800">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Soru Detayları</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-coffee-300 mb-1">
                İsim
              </label>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="bg-coffee-800/50 border-coffee-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-coffee-300 mb-1">
                Başlık
              </label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="bg-coffee-800/50 border-coffee-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-coffee-300 mb-1">
                Soru
              </label>
              <Textarea
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                className="bg-coffee-800/50 border-coffee-700 text-white"
                rows={4}
              />
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => onUpdate(editedName, editedTitle, editedQuestion)}
          >
            Soruyu Güncelle
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Yanıt</h3>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Yanıtınızı buraya yazın..."
            className="bg-coffee-800/50 border-coffee-700 text-white"
            rows={6}
          />
          <div className="flex gap-2 mt-4">
            <Button
              variant="default"
              onClick={() => onAnswer(answer, true)}
              disabled={!answer.trim()}
            >
              Yanıtla ve Yayınla
            </Button>
            <Button
              variant="outline"
              onClick={() => onAnswer(answer, false)}
              disabled={!answer.trim()}
            >
              Yanıtla (Taslak)
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              İptal
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}; 