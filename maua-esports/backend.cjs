const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config();



app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

async function conectarAoMongoDB() {
  await mongoose.connect(process.env.MONGO_URL);
}

// Configuração do Multer
const storage = multer.memoryStorage(); // Armazena na memória (para MongoDB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Apenas imagens são permitidas (jpeg, jpg, png, svg)"));
  },
});

///////////////////////////////////////////////////////////////////////////////AREA DE JOGADORES ////////////////////////////////////////////////////////////////////

const jogadorSchema = mongoose.Schema({
  nome: { type: String, required: true },
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  foto: {
    data: Buffer,
    contentType: String,
    nomeOriginal: String,
  },


  insta: { type: String }, 
  twitter: { type: String }, 
  twitch: { type: String }, 


  time: {
    type: Number,
    ref: "Time",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Jogador = mongoose.model("Jogador", jogadorSchema);


app.post("/jogadores", upload.single("foto"), async (req, res) => {
  try {
    const { nome, titulo, descricao, insta, twitter, twitch, time } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "A foto é obrigatória" });
    }

    const novoJogador = new Jogador({
      nome,
      titulo,
      descricao,
      foto: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        nomeOriginal: req.file.originalname,
      },
      insta: insta || null,
      twitter: twitter || null,
      twitch: twitch || null,
      time,
    });

    await novoJogador.save();
    
    // Retorna todos os campos, incluindo redes sociais
    res.status(201).json({
      _id: novoJogador._id,
      nome: novoJogador.nome,
      titulo: novoJogador.titulo,
      descricao: novoJogador.descricao,
      insta: novoJogador.insta,
      twitter: novoJogador.twitter,
      twitch: novoJogador.twitch,
      time: novoJogador.time,
      createdAt: novoJogador.createdAt,
      message: "Jogador criado com sucesso",
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar jogador", error });
  }
});

app.get("/jogadores", async (req, res) => {
  try {
    const jogadores = await Jogador.find().lean(); // .lean() para objetos JS simples

    // Busca manual dos times
    const times = await Time.find({
      id: { $in: jogadores.map((j) => j.time) },
    });

    const timesMap = times.reduce((acc, time) => {
      acc[time.id] = time;
      return acc;
    }, {});

    const resultado = jogadores.map((jogador) => ({
      ...jogador,
      time: timesMap[jogador.time] || null,
    }));

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar jogadores",
      error: error.message,
    });
  }
});

app.delete("/jogadores/:id", async (req, res) => {
  try {
    const jogadorRemovido = await Jogador.findByIdAndDelete(req.params.id);

    if (!jogadorRemovido) {
      return res.status(404).json({ message: "Jogador não encontrado" });
    }

    res.status(200).json({
      message: "Jogador removido com sucesso",
      id: jogadorRemovido._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover jogador", error });
  }
});

app.get("/jogadores/:id/imagem", async (req, res) => {
  try {
    const jogador = await Jogador.findById(req.params.id);

    if (!jogador || !jogador.foto || !jogador.foto.data) {
      return res.status(404).json({ message: "Imagem não encontrada" });
    }

    res.set("Content-Type", jogador.foto.contentType);
    res.send(jogador.foto.data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao recuperar imagem", error });
  }
});

app.get("/jogadores/:id", async (req, res) => {
  try {
    const jogador = await Jogador.findById(req.params.id)
      .select("-foto.data")
      .populate("time", "nome -id");

    if (!jogador) {
      return res.status(404).json({ message: "Jogador não encontrado" });
    }

    res.status(200).json(jogador);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar jogador", error });
  }
});

app.put("/jogadores/:id", upload.single("foto"), async (req, res) => {
  try {
    // Extrai os dados do corpo da requisição
    const { nome, titulo, descricao, insta, twitter, twitch } = req.body;

    // Verifica campos obrigatórios
    if (!nome || !titulo || !descricao) {
      return res.status(400).json({
        message: "Nome, título e descrição são obrigatórios",
      });
    }

    // Prepara os dados para atualização
    const updateData = {
      nome,
      titulo,
      descricao,
      insta: insta || undefined,
      twitter: twitter || undefined,
      twitch: twitch || undefined,
    };

    // Se uma nova imagem foi enviada
    if (req.file) {
      updateData.foto = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        nomeOriginal: req.file.originalname,
      };
    }

    // Atualiza no banco de dados
    const jogadorAtualizado = await Jogador.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-foto.data -__v"); // Remove dados binários da imagem e versão

    if (!jogadorAtualizado) {
      return res.status(404).json({
        message: "Jogador não encontrado",
      });
    }

    // Resposta com os dados atualizados
    res.status(200).json({
      message: "Jogador atualizado com sucesso",
      data: jogadorAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar jogador:", error);

    // Tratamento de erros específicos
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Erro de validação",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    if (error.code === 11000) {
      const campo = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `Erro: ${campo} já está em uso`,
        campo: campo,
      });
    }

    res.status(500).json({
      message: "Erro interno no servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

///////////////////////////////////////////////////////////////////////////////AREA DE TIMES ////////////////////////////////////////////////////////////////////////////////////

const timeSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nome: { type: String, required: true, unique: true },
  foto: {
    data: Buffer,
    contentType: String,
    nomeOriginal: String,
  },
  jogo: {
    data: Buffer,
    contentType: String,
    nomeOriginal: String,
  },
  rota: { type: String, required: true, unique: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Time = mongoose.model("Time", timeSchema);

// Rota para buscar time por ID numérico
app.get("/times/:id", async (req, res) => {
  try {
    const timeId = parseInt(req.params.id);
    const time = await Time.findOne({ id: timeId })
      .select("-foto.data -jogo.data -__v")
      .lean();

    if (!time) {
      return res
        .status(404)
        .json({ success: false, message: "Time não encontrado" });
    }

    // Adiciona a URL da logo ao objeto do time
    const timeComLogo = {
      ...time,
      logoUrl: `${req.protocol}://${req.get("host")}/times/${timeId}/logo`,
    };

    res.status(200).json(timeComLogo);
  } catch (error) {
    console.error("Erro ao buscar time:", error);
    res.status(500).json({ success: false, message: "Erro ao buscar time" });
  }
});
// Rota para servir a logo do time
app.get("/times/:id/logo", async (req, res) => {
  try {
    const timeId = parseInt(req.params.id);
    const time = await Time.findOne({ id: timeId });

    if (!time || !time.jogo || !time.jogo.data) {
      return res.status(404).send("Logo não encontrada");
    }

    res.set("Content-Type", time.jogo.contentType);
    res.send(time.jogo.data);
  } catch (error) {
    console.error("Erro ao buscar logo do time:", error);
    res.status(500).send("Erro ao buscar logo");
  }
});
// Rota para buscar jogadores por time ID
app.get("/times/:id/jogadores", async (req, res) => {
  try {
    const timeId = parseInt(req.params.id);

    // DEBUG: Verifique no console do servidor
    console.log(`Buscando jogadores para time ID: ${timeId}`);

    const jogadores = await Jogador.find({ time: timeId })
      .select("-foto.data -__v")
      .lean();

    // Adiciona URL da foto para cada jogador
    const jogadoresComImagens = jogadores.map((jogador) => ({
      ...jogador,
      fotoUrl: `/jogadores/${jogador._id}/imagem`,
    }));

    res.status(200).json(jogadoresComImagens);
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar jogadores do time",
    });
  }
});
// Rota para obter a foto do time
app.get("/times/:id/foto", async (req, res) => {
  try {
    const time = await Time.findOne({ id: req.params.id });

    if (!time || !time.foto || !time.foto.data) {
      return res.status(404).send("Imagem não encontrada");
    }

    res.set("Content-Type", time.foto.contentType);
    res.send(time.foto.data);
  } catch (error) {
    res.status(500).send("Erro ao carregar imagem");
  }
});

// Rota para obter o logo do jogo
app.get("/times/:id/jogo", async (req, res) => {
  try {
    const time = await Time.findOne({ id: req.params.id });

    if (!time || !time.jogo || !time.jogo.data) {
      return res.status(404).send("Imagem não encontrada");
    }

    res.set("Content-Type", time.jogo.contentType);
    res.send(time.jogo.data);
  } catch (error) {
    res.status(500).send("Erro ao carregar imagem");
  }
});

app.post("/times",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "jogo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id, nome, rota } = req.body;
      const fotoFile = req.files["foto"][0];
      const jogoFile = req.files["jogo"][0];

      // Validações
      if (!id || !nome || !rota) {
        return res
          .status(400)
          .json({ message: "ID, nome e rota são obrigatórios" });
      }
      if (!fotoFile || !jogoFile) {
        return res
          .status(400)
          .json({ message: "Foto do time e logo do jogo são obrigatórios" });
      }

      const novoTime = new Time({
        id,
        nome,
        rota,
        foto: {
          data: fotoFile.buffer,
          contentType: fotoFile.mimetype,
          nomeOriginal: fotoFile.originalname,
        },
        jogo: {
          data: jogoFile.buffer,
          contentType: jogoFile.mimetype,
          nomeOriginal: jogoFile.originalname,
        },
      });

      await novoTime.save();
      res.status(201).json({
        id: novoTime.id,
        nome: novoTime.nome,
        rota: novoTime.rota,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          message: "Erro: ID, nome ou rota já existem",
          error: error.keyValue,
        });
      }
      res.status(500).json({ message: "Erro ao criar time", error });
    }
  }
);

app.get("/times", async (req, res) => {
  try {
    const times = await Time.find().select("-foto.data -jogo.data");
    res.status(200).json(times);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar times", error });
  }
});


app.delete("/admins/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validação robusta do ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Formato de ID inválido",
        receivedId: id,
        expectedFormat: "ObjectId (24 caracteres hexadecimais)"
      });
    }

    const result = await Admin.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhum admin encontrado com este ID"
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin excluído com sucesso"
    });

  } catch (error) {
    console.error('Erro no backend:', {
      message: error.message,
      stack: error.stack,
      receivedId: req.params.id
    });
    res.status(500).json({
      success: false,
      message: "Erro interno no servidor"
    });
  }
});

app.put(
  "/times/:id",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "jogo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { nome, rota } = req.body;
      const updateData = { nome, rota };
      const fotoFile = req.files?.["foto"]?.[0];
      const jogoFile = req.files?.["jogo"]?.[0];

      if (fotoFile) {
        updateData.foto = {
          data: fotoFile.buffer,
          contentType: fotoFile.mimetype,
          nomeOriginal: fotoFile.originalname,
        };
      }

      if (jogoFile) {
        updateData.jogo = {
          data: jogoFile.buffer,
          contentType: jogoFile.mimetype,
          nomeOriginal: jogoFile.originalname,
        };
      }

      const timeAtualizado = await Time.findOneAndUpdate(
        { id: req.params.id },
        updateData,
        { new: true }
      ).select("-foto.data -jogo.data");

      if (!timeAtualizado) {
        return res.status(404).json({ message: "Time não encontrado" });
      }

      res.status(200).json(timeAtualizado);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          message: "Erro: Nome ou rota já existem",
          error: error.keyValue,
        });
      }
      res.status(500).json({ message: "Erro ao atualizar time", error });
    }
  }
);

app.delete("/times/:id", async (req, res) => {
  try {
    // Verifica se existem jogadores associados
    const jogadoresDoTime = await Jogador.countDocuments({
      "time.id": parseInt(req.params.id),
    });

    if (jogadoresDoTime > 0) {
      return res.status(400).json({
        message:
          "Não é possível excluir o time pois existem jogadores associados",
      });
    }

    const timeRemovido = await Time.findOneAndDelete({ id: req.params.id });

    if (!timeRemovido) {
      return res.status(404).json({ message: "Time não encontrado" });
    }

    res.status(200).json({
      message: "Time removido com sucesso",
      id: timeRemovido.id,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover time", error });
  }
});
////////////////////////////////////////////////////////////////////////////////AREA DE ADMINISTRADORES ////////////////////////////////////////////////////////////////////
const adminSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  foto: {
    data: Buffer,
    contentType: String,
    nomeOriginal: String,
  },
  insta: { type: String },
  twitter: { type: String },
  twitch: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

// Rota para listar todos os administradores
app.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.find({})
      .select("-foto.data -__v") // Exclui os dados binários da foto e versão
      .sort({ createdAt: -1 }) // Ordena por mais recente primeiro
      .lean();

    // Adiciona a URL para acessar a foto de cada admin
    const adminsComFotoUrl = admins.map((admin) => ({
      ...admin,
      fotoUrl: admin.foto
        ? `${req.protocol}://${req.get("host")}/admins/${admin._id}/foto`
        : null,
    }));

    res.status(200).json(adminsComFotoUrl);
  } catch (error) {
    console.error("Erro ao buscar administradores:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar administradores" });
  }
});

// Rota para servir a foto do admin
app.get("/admins/:id/foto", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin || !admin.foto || !admin.foto.data) {
      return res.status(404).send("Foto não encontrada");
    }

    res.set("Content-Type", admin.foto.contentType);
    res.send(admin.foto.data);
  } catch (error) {
    console.error("Erro ao buscar foto do admin:", error);
    res.status(500).send("Erro ao buscar foto");
  }
});

// Rota para criar novo admin
app.post("/admins", upload.single("foto"), async (req, res) => {
  try {
    // Verifique se os campos estão vindo no body ou no form-data
    const { nome, titulo, descricao, insta, twitter, twitch } = req.body;
    const fotoFile = req.file; // Agora usando req.file do multer

    // Validação mais robusta
    const camposFaltantes = [];
    if (!nome?.trim()) camposFaltantes.push("nome");
    if (!titulo?.trim()) camposFaltantes.push("título");
    if (!descricao?.trim()) camposFaltantes.push("descrição");

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos obrigatórios faltando: ${camposFaltantes.join(", ")}`,
        camposFaltantes,
      });
    }

    const adminData = {
      nome: nome.trim(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      insta: insta?.trim() || null,
      twitter: twitter?.trim() || null,
      twitch: twitch?.trim() || null,
    };

    // Processar foto se foi enviada
    if (fotoFile) {
      adminData.foto = {
        data: fotoFile.buffer, // Usando buffer do multer
        contentType: fotoFile.mimetype,
        nomeOriginal: fotoFile.originalname,
      };
    }

    const novoAdmin = await Admin.create(adminData);

    res.status(201).json({
      success: true,
      admin: {
        ...novoAdmin.toObject(),
        fotoUrl: `${req.protocol}://${req.get("host")}/admins/${
          novoAdmin._id
        }/foto`,
        foto: undefined,
      },
    });
  } catch (error) {
    console.error("Erro ao criar admin:", error);

    if (error.code === 11000) {
      const campo = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${campo} já está em uso`,
        campo,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro interno no servidor",
      error: error.message,
    });
  }
});

// Rota PUT (Edição)
app.put("/admins/:id", upload.single("foto"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      nome: req.body.nome?.trim(),
      titulo: req.body.titulo?.trim(),
      descricao: req.body.descricao?.trim(),
      // Remova campos vazios em vez de definir como null
      ...(req.body.insta && { insta: req.body.insta.trim() }),
      ...(req.body.twitter && { twitter: req.body.twitter.trim() }),
      ...(req.body.twitch && { twitch: req.body.twitch.trim() }),
    };

    if (req.file) {
      updateData.foto = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updated = await Admin.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set para atualização parcial
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Admin não encontrado" });
    }

    res.json({
      _id: updated._id,
      nome: updated.nome,
      titulo: updated.titulo,
      descricao: updated.descricao,
      insta: updated.insta || undefined, // Envie undefined em vez de null
      twitter: updated.twitter || undefined,
      twitch: updated.twitch || undefined,
      fotoUrl: `${req.protocol}://${req.get("host")}/admins/${
        updated._id
      }/foto`,
    });
  } catch (error) {
    console.error("Erro na edição:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.get("/admins/:id/foto", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("ID inválido");
    }

    const admin = await Admin.findById(req.params.id);

    if (!admin || !admin.foto || !admin.foto.data) {
      // Retorna uma imagem padrão se não encontrar
      const defaultImage = path.join(__dirname, "path/para/imagem-padrao.jpg");
      return res.sendFile(defaultImage);
    }

    res.set("Content-Type", admin.foto.contentType);
    res.send(admin.foto.data);
  } catch (error) {
    console.error("Erro ao buscar foto:", error);
    res.status(500).send("Erro ao carregar imagem");
  }
});
/////////////////////////////////////////////////////////////////////    PERFIL   ///////////////////////////////////////////////////////////////////////////////////////////////
const perfilSchema = new mongoose.Schema({
  src: { type: String, required: true },
});

const Perfil = mongoose.model("perfil", perfilSchema);

app.post("/perfil-adicionar", async (req, res) => {
  try {
    const novoPerfil = new Perfil(req.body);
    await novoPerfil.save();
    res.status(201).send(novoPerfil);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/perfil-puxar", async (req, res) => {
  try {
    const perfil = await Perfil.find();
    res.status(200).send(perfil);
  } catch (error) {
    res.status(500).send(error);
  }
});
/////////////////////////////////////////////////////////////////////////  PORTA  //////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(3000, () => {
  try {
    conectarAoMongoDB();
    console.log("up and running");
  } catch (e) {
    console.log("Erro", e);
  }
});
