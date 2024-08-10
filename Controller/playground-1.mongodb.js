/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'Gestion-ecole';// Utiliser la base de données Gestion-ecole
use('Gestion-ecole');

// 1. Users Collection
db.createCollection("users", {
    validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nom", "prenom", "email", "password", "role"],
          properties: {
            nom: { bsonType: "string" },
            prenom: { bsonType: "string" },
            email: { bsonType: "string", pattern: "^\\S+@\\S+\\.\\S+$" },
            password: { bsonType: "string" },
            role: { enum: ["RP", "Professeur", "Attaché", "Étudiant"] },
            photo: { 
              bsonType: "string",
              description: "Chemin ou URL de la photo de l'utilisateur"
      }
    }
  }
  }
});

// 2. Years Collection
db.createCollection("years", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["annee_debut", "annee_fin"],
      properties: {
        annee_debut: { bsonType: "int" },
        annee_fin: { bsonType: "int" }
      }
    }
  }
});

// 3. Classes Collection
db.createCollection("classes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["libelle", "filiere", "niveau", "year_id"],
      properties: {
        libelle: { bsonType: "string" },
        filiere: { bsonType: "string" },
        niveau: { bsonType: "string" },
        year_id: { bsonType: "objectId" }
      }
    }
  }
});

// 4. Professors Collection
db.createCollection("professors", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom", "prenom", "specialite", "grade"],
      properties: {
        nom: { bsonType: "string" },
        prenom: { bsonType: "string" },
        specialite: { bsonType: "string" },
        grade: { bsonType: "string" }
      }
    }
  }
});

// 5. Rooms Collection
db.createCollection("rooms", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom", "numero", "nombre_de_places"],
      properties: {
        nom: { bsonType: "string" },
        numero: { bsonType: "string" },
        nombre_de_places: { bsonType: "int" }
      }
    }
  }
});

// 6. Semesters Collection
db.createCollection("semesters", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["libelle", "year_id"],
      properties: {
        libelle: { bsonType: "string" },
        year_id: { bsonType: "objectId" }
      }
    }
  }
});

// 7. Modules Collection
db.createCollection("modules", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["libelle"],
      properties: {
        libelle: { bsonType: "string" }
      }
    }
  }
});

// 8. Courses Collection
db.createCollection("courses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["professor_id", "module_id", "class_id", "semester_id", "quota_horaire", "etat"],
      properties: {
        professor_id: { bsonType: "objectId" },
        module_id: { bsonType: "objectId" },
        class_id: { bsonType: "objectId" },
        semester_id: { bsonType: "objectId" },
        quota_horaire: { bsonType: "int" },
        etat: { enum: ["En Cours", "Terminé"] }
      }
    }
  }
});

// 9. Sessions Collection
db.createCollection("sessions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["course_id", "date", "heure_debut", "heure_fin", "nombre_heures", "mode", "room_id", "etat"],
      properties: {
        course_id: { bsonType: "objectId" },
        date: { bsonType: "date" },
        heure_debut: { bsonType: "string" },
        heure_fin: { bsonType: "string" },
        nombre_heures: { bsonType: "int" },
        mode: { enum: ["en ligne", "présentiel"] },
        room_id: { bsonType: "objectId" },
        etat: { enum: ["validée", "non validée"] }
      }
    }
  }
});

// 10. Attendances Collection
db.createCollection("attendances", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["session_id", "student_id", "presence", "justification", "etat_justification"],
      properties: {
        session_id: { bsonType: "objectId" },
        student_id: { bsonType: "objectId" },
        presence: { bsonType: "bool" },
        justification: { bsonType: "string" },
        etat_justification: { enum: ["acceptée", "refusée", "en attente"] }
      }
    }
  }
});

// 11. Notifications Collection
db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["student_id", "type_notification", "date", "heure", "statut"],
      properties: {
        student_id: { bsonType: "objectId" },
        type_notification: { enum: ["avertissement", "convocation"] },
        date: { bsonType: "date" },
        heure: { bsonType: "string" },
        statut: { enum: ["envoyé", "non envoyé"] }
      }
    }
  }
});

print("Toutes les collections ont été créées avec succès.");