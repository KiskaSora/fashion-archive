import { useState, useRef, useEffect } from "react";

// ─── SAMPLE DATA ───────────────────────────────────────────────────────────────
const SAMPLE_CLOTHES = [
  {
    id: 1,
    title: "Cyber Y2K Hoodie",
    brand: "Archive Find",
    description: "Oversized zip hoodie с silver hardware и fuzzy подкладкой",
    category: "Худи",
    style: "Y2K",
    gender: "Унисекс",
    tags: ["cyber", "silver", "oversize"],
    fav: true,
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Pastel Trench Coat",
    brand: "Vintage",
    description: "Baby pink оверсайз тренч, очень мягкий",
    category: "Куртки",
    style: "Coquette",
    gender: "Женское",
    tags: ["pink", "trench", "soft", "vintage"],
    fav: false,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Platform Mary Janes",
    brand: "Demonia",
    description: "Чёрные платформы с серебряными пряжками",
    category: "Обувь",
    style: "Goth",
    gender: "Женское",
    tags: ["platform", "black", "buckle"],
    fav: true,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Butterfly Baby Tee",
    brand: "DIY",
    description: "Белый baby tee с butterfly print",
    category: "Футболки",
    style: "Y2K",
    gender: "Женское",
    tags: ["butterfly", "white", "crop", "print"],
    fav: false,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Cargo Pants",
    brand: "Dickies",
    description: "Dark olive baggy cargo pants, много карманов",
    category: "Штаны",
    style: "Streetwear",
    gender: "Унисекс",
    tags: ["cargo", "olive", "baggy"],
    fav: false,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Star Chain Necklace",
    brand: "Vintage",
    description: "Тонкая золотая цепочка со звёздными подвесками",
    category: "Украшения",
    style: "Coquette",
    gender: "Унисекс",
    tags: ["gold", "star", "chain", "delicate"],
    fav: true,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Mesh Long Sleeve",
    brand: "ASOS",
    description: "Полупрозрачный mesh в нюдовом цвете",
    category: "Футболки",
    style: "Y2K",
    gender: "Женское",
    tags: ["mesh", "nude", "transparent"],
    fav: false,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Vintage Mini Skirt",
    brand: "Thrift",
    description: "Красная мини-юбка в клетку",
    category: "Юбки",
    style: "Grunge",
    gender: "Женское",
    tags: ["plaid", "red", "mini", "plaid"],
    fav: false,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop",
  },
];

const CATEGORIES = ["Все", "Худи", "Футболки", "Куртки", "Обувь", "Аксессуары", "Украшения", "Штаны", "Юбки", "Платья"];
const STYLES = ["Все", "Y2K", "Grunge", "Goth", "Streetwear", "Archive", "Acubi", "Coquette", "Kawaii", "Cybercore", "Old Money"];
const GENDERS = ["Все", "Мужское", "Женское", "Унисекс"];

const EMPTY_FORM = {
  title: "",
  brand: "",
  description: "",
  category: "Худи",
  style: "Y2K",
  gender: "Унисекс",
  tags: "",
  image: "",
};

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("archive");
  const [clothes, setClothes] = useState(SAMPLE_CLOTHES);

  // Archive filters
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Все");
  const [filterStyle, setFilterStyle] = useState("Все");
  const [filterGender, setFilterGender] = useState("Все");
  const [showFavOnly, setShowFavOnly] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Outfit builder
  const [outfitItems, setOutfitItems] = useState([]);
  const [outfitDrag, setOutfitDrag] = useState(null);
  const [activeOutfitId, setActiveOutfitId] = useState(null);
  const canvasRef = useRef(null);

  // Moodboard
  const [moodItems, setMoodItems] = useState([]);
  const [moodDrag, setMoodDrag] = useState(null);
  const [moodAddUrl, setMoodAddUrl] = useState("");
  const moodRef = useRef(null);

  // ── Filtered list ──────────────────────────────────────────────
  const filtered = clothes.filter((c) => {
    const q = search.toLowerCase();
    if (q && !c.title.toLowerCase().includes(q) && !c.tags.join(" ").toLowerCase().includes(q) && !c.brand?.toLowerCase().includes(q)) return false;
    if (filterCat !== "Все" && c.category !== filterCat) return false;
    if (filterStyle !== "Все" && c.style !== filterStyle) return false;
    if (filterGender !== "Все" && c.gender !== filterGender) return false;
    if (showFavOnly && !c.fav) return false;
    return true;
  });

  const toggleFav = (id, e) => {
    if (e) e.stopPropagation();
    setClothes((cl) => cl.map((c) => (c.id === id ? { ...c, fav: !c.fav } : c)));
  };

  const addItem = () => {
    if (!form.title || !form.image) return;
    const newItem = {
      id: Date.now(),
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      fav: false,
    };
    setClothes((cl) => [newItem, ...cl]);
    setForm(EMPTY_FORM);
    setShowAddModal(false);
  };

  // ── Outfit builder ─────────────────────────────────────────────
  const addToOutfit = (item) => {
    const newId = Date.now();
    setOutfitItems((prev) => [
      ...prev,
      {
        id: newId,
        image: item.image,
        title: item.title,
        x: 60 + Math.random() * 180,
        y: 60 + Math.random() * 180,
        scale: 1,
        rotation: 0,
      },
    ]);
    setActiveOutfitId(newId);
  };

  const handleOutfitMouseDown = (e, id) => {
    e.preventDefault();
    setActiveOutfitId(id);
    const item = outfitItems.find((i) => i.id === id);
    setOutfitDrag({ id, startX: e.clientX, startY: e.clientY, origX: item.x, origY: item.y });
  };

  useEffect(() => {
    if (!outfitDrag) return;
    const onMove = (e) => {
      const dx = e.clientX - outfitDrag.startX;
      const dy = e.clientY - outfitDrag.startY;
      setOutfitItems((prev) =>
        prev.map((i) => (i.id === outfitDrag.id ? { ...i, x: outfitDrag.origX + dx, y: outfitDrag.origY + dy } : i))
      );
    };
    const onUp = () => setOutfitDrag(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [outfitDrag]);

  const adjustOutfitItem = (id, key, delta) => {
    setOutfitItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        if (key === "scale") return { ...i, scale: Math.max(0.15, Math.min(3, i.scale + delta)) };
        if (key === "rotation") return { ...i, rotation: i.rotation + delta };
        return i;
      })
    );
  };

  // ── Moodboard ──────────────────────────────────────────────────
  const addMoodItem = () => {
    if (!moodAddUrl.trim()) return;
    setMoodItems((prev) => [
      ...prev,
      { id: Date.now(), image: moodAddUrl.trim(), x: 40 + Math.random() * 320, y: 40 + Math.random() * 260, w: 200 },
    ]);
    setMoodAddUrl("");
  };

  const handleMoodMouseDown = (e, id) => {
    e.preventDefault();
    const item = moodItems.find((i) => i.id === id);
    setMoodDrag({ id, startX: e.clientX, startY: e.clientY, origX: item.x, origY: item.y });
  };

  useEffect(() => {
    if (!moodDrag) return;
    const onMove = (e) => {
      const dx = e.clientX - moodDrag.startX;
      const dy = e.clientY - moodDrag.startY;
      setMoodItems((prev) =>
        prev.map((i) => (i.id === moodDrag.id ? { ...i, x: moodDrag.origX + dx, y: moodDrag.origY + dy } : i))
      );
    };
    const onUp = () => setMoodDrag(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [moodDrag]);

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="app">
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-star">✦</span>
            <span>Digital Fashion Archive</span>
            <span className="logo-star">✦</span>
          </div>
          <nav className="nav">
            {[
              ["archive", "✧ Archive"],
              ["outfit", "✧ Outfit Builder"],
              ["moodboard", "✧ Moodboard"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`nav-btn${tab === key ? " active" : ""}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ══════════════════════════════ ARCHIVE PAGE ══════════════════════════════ */}
      {tab === "archive" && (
        <main className="page archive-page">
          {/* Controls row */}
          <div className="controls-row">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                placeholder="поиск по названию, тегу, бренду..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className={`fav-filter-btn${showFavOnly ? " active" : ""}`}
              onClick={() => setShowFavOnly((v) => !v)}
            >
              {showFavOnly ? "♥" : "♡"} Избранное
            </button>
            <button className="add-btn" onClick={() => setShowAddModal(true)}>
              ＋ Добавить вещь
            </button>
          </div>

          {/* Filters */}
          <div className="filters-area">
            <div className="filter-row">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`chip${filterCat === c ? " active" : ""}`}
                  onClick={() => setFilterCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="filter-row">
              {STYLES.map((s) => (
                <button
                  key={s}
                  className={`chip chip-style${filterStyle === s ? " active" : ""}`}
                  onClick={() => setFilterStyle(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="filter-row">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  className={`chip chip-gender${filterGender === g ? " active" : ""}`}
                  onClick={() => setFilterGender(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p className="result-count">{filtered.length} вещей</p>

          {/* Masonry grid */}
          <div className="masonry">
            {filtered.map((item) => (
              <div className="card" key={item.id} onClick={() => setSelectedItem(item)}>
                <div className="card-img-wrap">
                  <img src={item.image} alt={item.title} className="card-img" />
                  <div className="card-hover-overlay">
                    <button
                      className="quick-add-btn"
                      title="Добавить в образ"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToOutfit(item);
                        setTab("outfit");
                      }}
                    >
                      ✦ В образ
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-top-row">
                    <h3 className="card-title">{item.title}</h3>
                    <button
                      className={`fav-btn${item.fav ? " active" : ""}`}
                      onClick={(e) => toggleFav(item.id, e)}
                    >
                      {item.fav ? "♥" : "♡"}
                    </button>
                  </div>
                  {item.brand && <p className="card-brand">{item.brand}</p>}
                  <div className="card-chips">
                    <span className="tag tag-cat">{item.category}</span>
                    <span className="tag tag-style">{item.style}</span>
                    <span className="tag tag-gender">{item.gender}</span>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="empty-state">
                <span>✦</span>
                <p>Ничего не найдено</p>
                <button className="add-btn" onClick={() => setShowAddModal(true)}>Добавить вещь</button>
              </div>
            )}
          </div>

          {/* ── ITEM DETAIL MODAL ── */}
          {selectedItem && (
            <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
              <div className="modal detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedItem(null)}>✕</button>
                <div className="detail-layout">
                  <img src={selectedItem.image} alt={selectedItem.title} className="detail-img" />
                  <div className="detail-info">
                    <h2 className="detail-title">{selectedItem.title}</h2>
                    {selectedItem.brand && <p className="detail-brand">by {selectedItem.brand}</p>}
                    {selectedItem.description && <p className="detail-desc">{selectedItem.description}</p>}
                    <div className="card-chips" style={{ marginTop: 14 }}>
                      <span className="tag tag-cat">{selectedItem.category}</span>
                      <span className="tag tag-style">{selectedItem.style}</span>
                      <span className="tag tag-gender">{selectedItem.gender}</span>
                    </div>
                    {selectedItem.tags?.length > 0 && (
                      <div className="detail-tags">
                        {selectedItem.tags.map((t) => (
                          <span key={t} className="hashtag">#{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="detail-actions">
                      <button
                        className={`fav-detail-btn${selectedItem.fav ? " active" : ""}`}
                        onClick={() => {
                          toggleFav(selectedItem.id);
                          setSelectedItem((si) => ({ ...si, fav: !si.fav }));
                        }}
                      >
                        {selectedItem.fav ? "♥ В избранном" : "♡ В избранное"}
                      </button>
                      <button
                        className="outfit-cta-btn"
                        onClick={() => {
                          addToOutfit(selectedItem);
                          setSelectedItem(null);
                          setTab("outfit");
                        }}
                      >
                        ✦ Добавить в образ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ADD ITEM MODAL ── */}
          {showAddModal && (
            <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
              <div className="modal add-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
                <h2 className="modal-title">＋ Добавить вещь</h2>
                <div className="form-body">
                  <div className="form-cols">
                    <div className="form-col">
                      <label className="form-label">Название *</label>
                      <input className="form-input" placeholder="Название вещи" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

                      <label className="form-label">Бренд</label>
                      <input className="form-input" placeholder="Бренд или источник" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />

                      <label className="form-label">Описание</label>
                      <textarea className="form-input form-textarea" placeholder="Описание..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

                      <label className="form-label">Теги (через запятую)</label>
                      <input className="form-input" placeholder="y2k, silver, oversize" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                    </div>
                    <div className="form-col">
                      <label className="form-label">Категория</label>
                      <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        {CATEGORIES.filter((c) => c !== "Все").map((c) => <option key={c}>{c}</option>)}
                      </select>

                      <label className="form-label">Стиль</label>
                      <select className="form-input" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })}>
                        {STYLES.filter((s) => s !== "Все").map((s) => <option key={s}>{s}</option>)}
                      </select>

                      <label className="form-label">Пол</label>
                      <select className="form-input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                        {GENDERS.filter((g) => g !== "Все").map((g) => <option key={g}>{g}</option>)}
                      </select>

                      <label className="form-label">Ссылка на фото *</label>
                      <input className="form-input" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />

                      {form.image && (
                        <img
                          src={form.image}
                          alt="preview"
                          className="form-preview"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                    </div>
                  </div>
                  <button className="submit-btn" onClick={addItem}>✦ Добавить в архив</button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ══════════════════════════════ OUTFIT BUILDER ══════════════════════════════ */}
      {tab === "outfit" && (
        <main className="page outfit-page">
          {/* Sidebar */}
          <aside className="outfit-sidebar">
            <h3 className="sidebar-title">✧ Гардероб</h3>
            <p className="sidebar-hint">Нажми на вещь чтобы добавить на холст</p>
            <div className="sidebar-list">
              {clothes.map((item) => (
                <div key={item.id} className="sidebar-item" onClick={() => addToOutfit(item)}>
                  <img src={item.image} alt={item.title} className="sidebar-img" />
                  <div className="sidebar-info">
                    <span className="sidebar-name">{item.title}</span>
                    <span className="sidebar-meta">{item.category} · {item.style}</span>
                  </div>
                  <span className="sidebar-add">＋</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Canvas */}
          <div className="outfit-canvas-wrap">
            <div className="outfit-toolbar">
              <span className="toolbar-hint">
                ✦ Тяни вещи для перемещения · Используй контролы для масштаба и поворота
              </span>
              <button className="clear-btn" onClick={() => { setOutfitItems([]); setActiveOutfitId(null); }}>
                Очистить холст
              </button>
            </div>
            <div
              className="outfit-canvas"
              ref={canvasRef}
              onClick={() => setActiveOutfitId(null)}
            >
              {outfitItems.length === 0 && (
                <div className="canvas-empty">
                  <div className="canvas-empty-icon">✦</div>
                  <p>Добавь вещи из гардероба</p>
                  <p className="canvas-empty-sub">для создания образа</p>
                </div>
              )}
              {outfitItems.map((item) => {
                const isActive = activeOutfitId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`canvas-item${isActive ? " active" : ""}`}
                    style={{
                      left: item.x,
                      top: item.y,
                      transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg)`,
                      cursor: outfitDrag?.id === item.id ? "grabbing" : "grab",
                      zIndex: isActive ? 100 : 1,
                    }}
                    onMouseDown={(e) => handleOutfitMouseDown(e, item.id)}
                  >
                    <img src={item.image} alt={item.title} draggable={false} />
                    {isActive && (
                      <div className="canvas-controls" onMouseDown={(e) => e.stopPropagation()}>
                        <button onClick={() => adjustOutfitItem(item.id, "scale", -0.1)} title="Уменьшить">−</button>
                        <button onClick={() => adjustOutfitItem(item.id, "rotation", -15)} title="Повернуть влево">↺</button>
                        <button onClick={() => adjustOutfitItem(item.id, "rotation", 15)} title="Повернуть вправо">↻</button>
                        <button onClick={() => adjustOutfitItem(item.id, "scale", 0.1)} title="Увеличить">＋</button>
                        <button
                          className="remove-item-btn"
                          onClick={() => { setOutfitItems((prev) => prev.filter((i) => i.id !== item.id)); setActiveOutfitId(null); }}
                          title="Удалить"
                        >✕</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════ MOODBOARD PAGE ══════════════════════════════ */}
      {tab === "moodboard" && (
        <main className="page moodboard-page">
          <div className="mood-toolbar">
            <div className="mood-input-wrap">
              <input
                className="mood-input"
                placeholder="Вставь ссылку на картинку и нажми Enter..."
                value={moodAddUrl}
                onChange={(e) => setMoodAddUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMoodItem()}
              />
              <button className="mood-add-btn" onClick={addMoodItem}>＋ Добавить</button>
            </div>
            <button className="clear-btn" onClick={() => setMoodItems([])}>Очистить</button>
          </div>

          <div className="moodboard-canvas" ref={moodRef}>
            {moodItems.length === 0 && (
              <div className="canvas-empty">
                <div className="canvas-empty-icon">✦</div>
                <p>Создай свой moodboard</p>
                <p className="canvas-empty-sub">Вставь ссылку на картинку выше · Тяни для перемещения</p>
              </div>
            )}
            {moodItems.map((item) => (
              <div
                key={item.id}
                className="mood-item"
                style={{ left: item.x, top: item.y, width: item.w, cursor: moodDrag?.id === item.id ? "grabbing" : "grab" }}
                onMouseDown={(e) => handleMoodMouseDown(e, item.id)}
              >
                <img src={item.image} alt="" draggable={false} onError={(e) => (e.target.src = "")} />
                <div className="mood-controls" onMouseDown={(e) => e.stopPropagation()}>
                  <button onClick={() => setMoodItems((prev) => prev.map((i) => i.id === item.id ? { ...i, w: Math.max(80, i.w - 40) } : i))}>−</button>
                  <button onClick={() => setMoodItems((prev) => prev.map((i) => i.id === item.id ? { ...i, w: i.w + 40 } : i))}>＋</button>
                  <button className="remove-item-btn" onClick={() => setMoodItems((prev) => prev.filter((i) => i.id !== item.id))}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
