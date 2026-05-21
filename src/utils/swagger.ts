import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dokumentasi API Pojok Teduh",
      version: "1.0.0",
      description: "Dokumentasi resmi untuk tim Frontend. Versi: 1.0.0. Stack: Express.js, PostgreSQL, Drizzle ORM, Cloudinary.",
    },
    servers: [
      {
        url: "https://capstone-pojokteduh.vercel.app",
        description: "Production Server (Vercel)",
      },
      {
        url: "http://localhost:8080",
        description: "Development Server (Local)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Masukkan token JWT yang didapat dari proses Login.",
        },
      },
    },
    paths: {
      // ==========================================
      // 1. GENERAL
      // ==========================================
      "/": {
        get: {
          tags: ["General"],
          summary: "Cek Status Server (Root)",
          description: "Endpoint dasar untuk memastikan server berjalan.",
          responses: { "200": { description: "Server berjalan normal" } }
        }
      },

      // ==========================================
      // 2. AUTHENTICATION (USER & ADMIN)
      // ==========================================
      "/auth/user/register": {
        post: {
          tags: ["Auth"],
          summary: "Registrasi User Baru",
          description: "Membuat akun pengguna baru dengan role USER.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "201": { description: "Sukses" }, "400": { description: "Validasi gagal / Email terdaftar" } }
        }
      },
      "/auth/user/login": {
        post: {
          tags: ["Auth"],
          summary: "Login User",
          description: "Autentikasi user dan mendapatkan JWT token.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Sukses login" }, "401": { description: "Gagal login" } }
        }
      },
      "/auth/admin/register": {
        post: {
          tags: ["Auth"],
          summary: "Registrasi Admin",
          description: "Membuat akun baru dengan role ADMIN.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "201": { description: "Sukses" } }
        }
      },
      "/auth/admin/login": {
        post: {
          tags: ["Auth"],
          summary: "Login Admin",
          description: "Autentikasi admin dan mendapatkan JWT token.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Sukses login" } }
        }
      },

      // ==========================================
      // 3. SPOTS (PUBLIK)
      // ==========================================
      "/spots/search": {
        get: {
          tags: ["Spots"],
          summary: "Cari & Filter Spot",
          description: "Mencari dan memfilter daftar tempat berdasarkan kata kunci dan/atau kombinasi filter preferensi.",
          parameters: [
            { name: "keyword", in: "query", schema: { type: "string" } },
            { name: "spot_type", in: "query", schema: { type: "string", enum: ["indoor", "outdoor"] } },
            { name: "crowdedness", in: "query", schema: { type: "string", enum: ["low", "high"] } },
            { name: "atmosphere", in: "query", schema: { type: "string", enum: ["busy", "quiet"] } },
            { name: "visit_type", in: "query", schema: { type: "string", enum: ["group", "alone"] } },
            { name: "mood", in: "query", schema: { type: "string", enum: ["relaxed", "focused"] } }
          ],
          responses: { "200": { description: "Sukses" } }
        }
      },
      "/spots/{slug}": {
        get: {
          tags: ["Spots"],
          summary: "Detail Spot by Slug",
          description: "Mengambil informasi lengkap satu spot berdasarkan slug URL-nya.",
          parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Sukses" }, "404": { description: "Not Found" } }
        }
      },
      "/spots/{id}/reviews": {
        get: {
          tags: ["Spots"],
          summary: "Semua Review sebuah Spot",
          description: "Mengambil seluruh review yang diberikan user untuk spot tertentu.",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { "200": { description: "Sukses" } }
        }
      },

      // ==========================================
      // 4. USERS PROFILE & ACCOUNT
      // ==========================================
      "/users/profile": {
        get: {
          tags: ["Users"],
          summary: "Lihat Profil Sendiri",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "Sukses" } }
        },
        put: {
          tags: ["Users"],
          summary: "Perbarui Profil",
          description: "Memperbarui username, email, dan/atau URL foto profil user.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    email: { type: "string" },
                    photoUrl: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Sukses" }, "400": { description: "Email sudah dipakai user lain" } }
        }
      },
      "/users/profile/password": {
        put: {
          tags: ["Users"],
          summary: "Ganti Password",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    oldPassword: { type: "string" },
                    newPassword: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Sukses" }, "400": { description: "Password lama salah" } }
        }
      },
      "/users/profile/reviews": {
        get: {
          tags: ["Users"],
          summary: "Riwayat Review Milik User",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "Sukses" } }
        }
      },

      // ==========================================
      // 5. BOOKMARKS
      // ==========================================
      "/bookmarks": {
        get: {
          tags: ["Bookmarks"],
          summary: "Lihat Daftar Bookmark",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "Sukses" } }
        },
        post: {
          tags: ["Bookmarks"],
          summary: "Tambah Bookmark",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { spot_id: { type: "integer" } }
                }
              }
            }
          },
          responses: { "201": { description: "Sukses" }, "400": { description: "Spot sudah di-bookmark sebelumnya" } }
        }
      },
      "/bookmarks/{id}": {
        delete: {
          tags: ["Bookmarks"],
          summary: "Hapus Bookmark",
          description: "Menghapus bookmark berdasarkan ID bookmark (bukan ID spot).",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { "200": { description: "Sukses" }, "404": { description: "Bookmark tidak ditemukan" } }
        }
      },

      // ==========================================
      // 6. REVIEWS
      // ==========================================
      "/reviews": {
        post: {
          tags: ["Reviews"],
          summary: "Buat/Perbarui Review (Upsert)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    spot_id: { type: "integer" },
                    rating: { type: "integer", description: "Nilai 1 hingga 5" },
                    comment: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Sukses" }, "400": { description: "Validasi rating gagal" } }
        }
      },

      // ==========================================
      // 7. ADMIN MANAGEMENT
      // ==========================================
      "/admins/profile": {
        get: {
          tags: ["Admins"],
          summary: "Profil Admin",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "Sukses" } }
        }
      },
      "/admins/dashboard": {
        get: {
          tags: ["Admins"],
          summary: "Ringkasan Dashboard",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "Sukses" } }
        }
      },
      "/admins/spots": {
        get: {
          tags: ["Admins"],
          summary: "Lihat Semua Spot (Admin View)",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "Sukses" } }
        },
        post: {
          tags: ["Admins"],
          summary: "Tambah Spot Baru",
          description: "Mendukung upload foto ke Cloudinary menggunakan multipart/form-data.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    spotType: { type: "string" },
                    crowdedness: { type: "string" },
                    atmosphere: { type: "string" },
                    visitType: { type: "string" },
                    mood: { type: "string" },
                    category: { type: "string" },
                    address: { type: "string" },
                    description: { type: "string" },
                    facilities: { type: "string" },
                    operationalHours: { type: "string" },
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                    photoUrl: { type: "string", format: "binary" }
                  }
                }
              }
            }
          },
          responses: { "201": { description: "Sukses" }, "400": { description: "Field wajib tidak diisi" } }
        }
      },
      "/admins/spots/{id}": {
        put: {
          tags: ["Admins"],
          summary: "Perbarui Data Spot",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    category: { type: "string" },
                    address: { type: "string" },
                    description: { type: "string" },
                    facilities: { type: "string" },
                    operationalHours: { type: "string" },
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                    spotType: { type: "string" },
                    crowdedness: { type: "string" },
                    atmosphere: { type: "string" },
                    visitType: { type: "string" },
                    mood: { type: "string" },
                    photoUrl: { type: "string", format: "binary" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Sukses" } }
        },
        delete: {
          tags: ["Admins"],
          summary: "Hapus Spot Permanen",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { "200": { description: "Sukses" }, "404": { description: "Spot tidak ditemukan!" } }
        }
      }
    }
  },
  apis: [], // JANGAN DIISI! Biarkan kosong agar terhindar dari Error 500 Vercel
};

export const swaggerSpec = swaggerJsdoc(options);