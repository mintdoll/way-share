import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  CATEGORY_LABELS,
  type RouteCategory,
  type RouteFormat,
  type RouteInput,
} from "../types/route";

interface RouteFormProps {
  onSubmit: (input: RouteInput) => Promise<void>;
}

interface FormValues {
  title: string;
  category: RouteCategory | "";
  location: string;
  budget: string;
  duration: string;
  description: string;
  format: RouteFormat;
  isPublic: boolean;
}

const INITIAL_VALUES: FormValues = {
  title: "",
  category: "",
  location: "",
  budget: "",
  duration: "",
  description: "",
  format: "friends",
  isPublic: true,
};

const MAX_IMAGE_SIZE = 60 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Не удалось прочитать выбранное изображение."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Ошибка при чтении изображения."));
    };

    reader.readAsDataURL(file);
  });
}

function isRouteCategory(value: string): value is RouteCategory {
  return (
    value === "walk" ||
    value === "food" ||
    value === "culture" ||
    value === "nature"
  );
}

export function RouteForm({ onSubmit }: RouteFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    setError(null);
    setPhotoUrl("");

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Выберите изображение в формате JPG, PNG или WebP.");
      event.currentTarget.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Для mock API выберите изображение размером не более 60 КБ.");
      event.currentTarget.value = "";
      return;
    }

    setPhotoLoading(true);

    try {
      const dataUrl = await readImageAsDataUrl(file);
      setPhotoUrl(dataUrl);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Не удалось прочитать изображение.",
      );
      event.currentTarget.value = "";
    } finally {
      setPhotoLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!values.category) {
      setError("Выберите категорию маршрута.");
      return;
    }

    if (!photoUrl) {
      setError("Добавьте фотографию маршрута.");
      return;
    }

    setSaving(true);

    try {
      const input: RouteInput = {
        authorId: 1,
        title: values.title.trim(),
        category: values.category,
        location: values.location.trim(),
        budget: Number(values.budget),
        duration: Number(values.duration),
        description: values.description.trim(),
        format: values.format,
        isPublic: values.isPublic,
        photoUrl,
        publishedAt: new Date().toISOString(),
        coordinates: null,
      };

      await onSubmit(input);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Не удалось опубликовать маршрут.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="route-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="wide">
          Название маршрута
          <input
            type="text"
            value={values.title}
            onChange={(event) => update("title", event.currentTarget.value)}
            minLength={5}
            maxLength={80}
            required
            placeholder="Например, Тихий вечер у Ангары"
          />
        </label>

        <label>
          Начальная точка
          <input
            type="text"
            value={values.location}
            onChange={(event) => update("location", event.currentTarget.value)}
            minLength={3}
            required
            placeholder="Например, Нижняя набережная"
          />
        </label>

        <label>
          Категория
          <select
            value={values.category}
            onChange={(event) => {
              const value = event.currentTarget.value;
              update("category", isRouteCategory(value) ? value : "");
            }}
            required
          >
            <option value="">Выберите категорию</option>
            {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
              <option key={category} value={category}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Бюджет, ₽
          <input
            type="number"
            value={values.budget}
            onChange={(event) => update("budget", event.currentTarget.value)}
            min="0"
            max="50000"
            step="1"
            required
          />
        </label>

        <label>
          Длительность, ч
          <input
            type="number"
            value={values.duration}
            onChange={(event) => update("duration", event.currentTarget.value)}
            min="1"
            max="24"
            step="1"
            required
          />
        </label>
      </div>

      <fieldset>
        <legend>Для кого этот маршрут?</legend>

        <label>
          <input
            type="radio"
            name="format"
            checked={values.format === "solo"}
            onChange={() => update("format", "solo")}
          />
          В одиночестве
        </label>

        <label>
          <input
            type="radio"
            name="format"
            checked={values.format === "friends"}
            onChange={() => update("format", "friends")}
          />
          С друзьями
        </label>

        <label>
          <input
            type="radio"
            name="format"
            checked={values.format === "family"}
            onChange={() => update("format", "family")}
          />
          С семьёй
        </label>
      </fieldset>

      <label>
        Описание
        <textarea
          value={values.description}
          onChange={(event) => update("description", event.currentTarget.value)}
          minLength={20}
          maxLength={500}
          required
          placeholder="Расскажите, куда идти и что посмотреть."
        />
      </label>

      <label>
        Фотография маршрута
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          required
        />
        <span className="muted">
          JPG, PNG или WebP, не более 60 КБ для локального mock API.
        </span>
      </label>

      {photoUrl && (
        <img
          className="route-form-preview"
          src={photoUrl}
          alt="Предпросмотр фотографии маршрута"
        />
      )}

      <label className="check">
        <input
          type="checkbox"
          checked={values.isPublic}
          onChange={(event) => update("isPublic", event.currentTarget.checked)}
        />
        Опубликовать маршрут для сообщества
      </label>

      {error && <p className="form-message" role="alert">{error}</p>}

      <div className="actions">
        <button
          className="primary-button"
          type="submit"
          disabled={saving || photoLoading}
        >
          {photoLoading
            ? "Обрабатываем фото..."
            : saving
              ? "Публикуем..."
              : "Опубликовать маршрут"}
        </button>
      </div>
    </form>
  );
}