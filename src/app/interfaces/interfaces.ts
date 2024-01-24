interface PreguntasTodas {
  response_code: number;
  results: Preguntas[];
}

interface Preguntas {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  respuestasAleatorias: string[];
}
