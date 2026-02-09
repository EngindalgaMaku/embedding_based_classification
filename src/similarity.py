from sklearn.metrics.pairwise import cosine_similarity as sklearn_cosine_similarity
import numpy as np


class SimilarityCalculator:
    @staticmethod
    def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
        """İki vektör arasındaki Kosinüs Benzerliğini hesaplar.

        scikit-learn cosine_similarity fonksiyonunu kullanır.
        Sonuç -1.0 ile 1.0 arasında bir float değerdir.

        Raises:
            ValueError: Vektör boyutları eşleşmiyorsa.
        """
        if len(vec_a) != len(vec_b):
            raise ValueError("Vektör boyutları eşleşmiyor")

        a = np.array(vec_a).reshape(1, -1)
        b = np.array(vec_b).reshape(1, -1)
        score = sklearn_cosine_similarity(a, b)[0][0]
        return float(score)
