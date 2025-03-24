// mongodb+srv://antonionapoli394:<password>@o-semeador-site.s0mxq.mongodb.net/?retryWrites=true&w=majority&appName=O-Semeador-site

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

app.use(express.json())
app.use(cors())
app.use(bodyParser.json());
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));




async function conectarAoMongoDB() {
    await mongoose.connect(process.env.MONGO_URL)
}

// Configuração do Multer
const storage = multer.memoryStorage(); // Armazena na memória (para MongoDB)
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|svg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, svg)'));
    }
});

const timeSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nome: { type: String, required: true, unique: true },
    foto: {
        data: Buffer,
        contentType: String,
        nomeOriginal: String
    },
    jogo: {
        data: Buffer,
        contentType: String,
        nomeOriginal: String
    },
    rota: { type: String, required: true, unique: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Time = mongoose.model('Time', timeSchema);

const jogadorSchema = mongoose.Schema({
    nome: { type: String, required: true },
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    foto: {
        data: Buffer,
        contentType: String,
        nomeOriginal: String
    },
    insta: { type: String, required: false, unique: true },
    twitter: { type: String, required: false, unique: true },
    twitch: { type: String, required: false, unique: true },
    time: { 
        type: Number,  // Mudado para Number
        ref: 'Time', 
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Jogador = mongoose.model('Jogador', jogadorSchema);


const usuarioSchema = mongoose.Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

const textoSchema = new mongoose.Schema({
    titulo: { type: String, required: false },
    subtitulo: { type: String, required: false },
    conteudo: { type: String, required: false }
});

const Texto = mongoose.model('Texto', textoSchema);

const imagemSchema = new mongoose.Schema({
    src: { type: String, required: true }
});

const Imagem = mongoose.model('Imagem', imagemSchema);

const perfilSchema = new mongoose.Schema({
    src: { type: String, required: true }
});

const Perfil = mongoose.model('perfil', perfilSchema);

const parceiroSchema = new mongoose.Schema({
    src: { type: String, required: true }
});


app.post('/jogadores', upload.single('foto'), async (req, res) => {
    try {
        const { nome, titulo, descricao, insta, twitter, twitch, time } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'A foto é obrigatória' });
        }

        const novoJogador = new Jogador({
            nome,
            titulo,
            descricao,
            foto: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
                nomeOriginal: req.file.originalname
            },
            insta,
            twitter,
            twitch,
            time
        });

        await novoJogador.save();
        res.status(201).json({
            _id: novoJogador._id,
            message: 'Jogador criado com sucesso'
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Erro: Redes sociais devem ser únicas',
                error: error.keyValue
            });
        }
        res.status(500).json({ message: 'Erro ao criar jogador', error });
    }
});

app.get('/jogadores', async (req, res) => {
    try {
      const jogadores = await Jogador.find().lean();  // .lean() para objetos JS simples
      
      // Busca manual dos times
      const times = await Time.find({ 
        id: { $in: jogadores.map(j => j.time) } 
      });
      
      const timesMap = times.reduce((acc, time) => {
        acc[time.id] = time;
        return acc;
      }, {});
      
      const resultado = jogadores.map(jogador => ({
        ...jogador,
        time: timesMap[jogador.time] || null
      }));
      
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ 
        message: 'Erro ao buscar jogadores',
        error: error.message 
      });
    }
  });

app.get('/jogadores/:id/imagem', async (req, res) => {
    try {
        const jogador = await Jogador.findById(req.params.id);

        if (!jogador || !jogador.foto || !jogador.foto.data) {
            return res.status(404).json({ message: 'Imagem não encontrada' });
        }

        res.set('Content-Type', jogador.foto.contentType);
        res.send(jogador.foto.data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao recuperar imagem', error });
    }
});

app.get('/jogadores/:id', async (req, res) => {
    try {
        const jogador = await Jogador.findById(req.params.id)
            .select('-foto.data')
            .populate('time', 'nome -id');

        if (!jogador) {
            return res.status(404).json({ message: 'Jogador não encontrado' });
        }

        res.status(200).json(jogador);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar jogador', error });
    }
});

app.put('/jogadores/:id', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { nome, titulo, descricao, insta, twitter, twitch, time } = req.body;
            const updateData = { nome, titulo, descricao, insta, twitter, twitch };

            // Se uma nova imagem foi enviada
            if (req.file) {
                updateData.foto = {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                    nomeOriginal: req.file.originalname
                };
            }

            const jogadorAtualizado = await Jogador.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            ).select('-foto.data').populate('time', 'nome -_id');

            if (!jogadorAtualizado) {
                return res.status(404).json({ message: 'Jogador não encontrado' });
            }

            res.status(200).json(jogadorAtualizado);
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    message: 'Erro: Redes sociais devem ser únicas',
                    error: error.keyValue
                });
            }
            res.status(500).json({ message: 'Erro ao atualizar jogador', error });
        }
    });
});


app.delete('/jogadores/:id', async (req, res) => {
    try {
        const jogadorRemovido = await Jogador.findByIdAndDelete(req.params.id);

        if (!jogadorRemovido) {
            return res.status(404).json({ message: 'Jogador não encontrado' });
        }

        res.status(200).json({
            message: 'Jogador removido com sucesso',
            id: jogadorRemovido._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover jogador', error });
    }
});

// Rota para obter a foto do time
app.get('/times/:id/foto', async (req, res) => {
    try {
        const time = await Time.findOne({ id: req.params.id });
        
        if (!time || !time.foto || !time.foto.data) {
            return res.status(404).send('Imagem não encontrada');
        }
        
        res.set('Content-Type', time.foto.contentType);
        res.send(time.foto.data);
    } catch (error) {
        res.status(500).send('Erro ao carregar imagem');
    }
});

// Rota para obter o logo do jogo
app.get('/times/:id/jogo', async (req, res) => {
    try {
        const time = await Time.findOne({ id: req.params.id });
        
        if (!time || !time.jogo || !time.jogo.data) {
            return res.status(404).send('Imagem não encontrada');
        }
        
        res.set('Content-Type', time.jogo.contentType);
        res.send(time.jogo.data);
    } catch (error) {
        res.status(500).send('Erro ao carregar imagem');
    }
});

app.post('/times', upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'jogo', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id, nome, rota } = req.body;
        const fotoFile = req.files['foto'][0];
        const jogoFile = req.files['jogo'][0];

        // Validações
        if (!id || !nome || !rota) {
            return res.status(400).json({ message: 'ID, nome e rota são obrigatórios' });
        }
        if (!fotoFile || !jogoFile) {
            return res.status(400).json({ message: 'Foto do time e logo do jogo são obrigatórios' });
        }

        const novoTime = new Time({
            id,
            nome,
            rota,
            foto: {
                data: fotoFile.buffer,
                contentType: fotoFile.mimetype,
                nomeOriginal: fotoFile.originalname
            },
            jogo: {
                data: jogoFile.buffer,
                contentType: jogoFile.mimetype,
                nomeOriginal: jogoFile.originalname
            }
        });

        await novoTime.save();
        res.status(201).json({
            id: novoTime.id,
            nome: novoTime.nome,
            rota: novoTime.rota
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Erro: ID, nome ou rota já existem',
                error: error.keyValue
            });
        }
        res.status(500).json({ message: 'Erro ao criar time', error });
    }
});

app.get('/times', async (req, res) => {
    try {
        const times = await Time.find().select('-foto.data -jogo.data');
        res.status(200).json(times);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar times', error });
    }
});

app.put('/times/:id', upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'jogo', maxCount: 1 }
]), async (req, res) => {
    try {
        const { nome, rota } = req.body;
        const updateData = { nome, rota };
        const fotoFile = req.files?.['foto']?.[0];
        const jogoFile = req.files?.['jogo']?.[0];

        if (fotoFile) {
            updateData.foto = {
                data: fotoFile.buffer,
                contentType: fotoFile.mimetype,
                nomeOriginal: fotoFile.originalname
            };
        }

        if (jogoFile) {
            updateData.jogo = {
                data: jogoFile.buffer,
                contentType: jogoFile.mimetype,
                nomeOriginal: jogoFile.originalname
            };
        }

        const timeAtualizado = await Time.findOneAndUpdate(
            { id: req.params.id },
            updateData,
            { new: true }
        ).select('-foto.data -jogo.data');

        if (!timeAtualizado) {
            return res.status(404).json({ message: 'Time não encontrado' });
        }

        res.status(200).json(timeAtualizado);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Erro: Nome ou rota já existem',
                error: error.keyValue
            });
        }
        res.status(500).json({ message: 'Erro ao atualizar time', error });
    }
});

app.delete('/times/:id', async (req, res) => {
    try {
        // Verifica se existem jogadores associados
        const jogadoresDoTime = await Jogador.countDocuments({
            'time.id': parseInt(req.params.id)
        });

        if (jogadoresDoTime > 0) {
            return res.status(400).json({
                message: 'Não é possível excluir o time pois existem jogadores associados'
            });
        }

        const timeRemovido = await Time.findOneAndDelete({ id: req.params.id });

        if (!timeRemovido) {
            return res.status(404).json({ message: 'Time não encontrado' });
        }

        res.status(200).json({
            message: 'Time removido com sucesso',
            id: timeRemovido.id
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover time', error });
    }
});

const Parceiro = mongoose.model('Parceiro', parceiroSchema);
app.post('/signup', async (req, res) => {
    try {

        const login = req.body.login
        const password = req.body.password
        const criptografada = await bcrypt.hash(password, 10)
        const usuario = new Usuario({
            login: login,
            password: criptografada
        })
        const respMongo = await usuario.save()
        console.log(respMongo)
        res.end()
    }
    catch (error) {
        console.log(error)
        res.status(409).end()
    }

})

app.post('/login', async (req, res) => {
    //login/senha que o usuário enviou
    const login = req.body.login
    const password = req.body.password
    //tentantmos encontrar no mongoDB
    const u = await Usuario.findOne({ login: req.body.login })
    // senao foi encontrado, encerra por aqui com o cóodigo 401
    if (!u) {
        return res.status(401).json({ mensagem: "login inválido" })
    }
    //se foi encontrado, comparamos a senha, após descriptográ-la
    const senhaValida = await bcrypt.compare(password, u.password)
    if (!senhaValida) {
        return res.status(401).json({ mensagem: "Senha inválida" })
    }
    //aqui vamos gerar o token e devolver para o cliente
    const token = jwt.sign(
        { login: login },
        "chave-secreta",
        { expiresIn: "1h" }
    )
    res.status(200).json({ token: token })

})

app.post('/new-text', async (req, res) => {
    try {
        const titulo = req.body.titulo
        const subtitulo = req.body.subtitulo
        const conteudo = req.body.conteudo

        const novoTexto = new Texto({ titulo, subtitulo, conteudo })
        await novoTexto.save();
        res.status(201).json(novoTexto);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao adicionar texto', error });
    }
});

app.get('/textos-puxar', async (req, res) => {
    try {
        const textos = await Texto.find();
        res.json(textos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao recuperar textos', error });
    }
});

app.put('/textos-atualizar', async (req, res) => {
    try {
        const { id, titulo, subtitulo, conteudo } = req.body;
        const textoAtualizado = await Texto.findByIdAndUpdate(id, { titulo, subtitulo, conteudo }, { new: true });
        res.status(200).json(textoAtualizado);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar texto', error });
    }
});

app.post('/imagens-adicionar', async (req, res) => {
    try {
        const novaImagem = new Imagem(req.body);
        await novaImagem.save();
        res.status(201).send(novaImagem);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/perfil-adicionar', async (req, res) => {
    try {
        const novoPerfil = new Perfil(req.body);
        await novoPerfil.save();
        res.status(201).send(novoPerfil);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/perfil-puxar', async (req, res) => {
    try {
        const perfil = await Perfil.find();
        res.status(200).send(perfil);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Rota para remover uma imagem
app.delete('/imagens-remover/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const imagemRemovida = await Imagem.findByIdAndDelete(id);
        if (!imagemRemovida) {
            return res.status(404).send();
        }
        res.status(200).send(imagemRemovida);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/imagens-puxar', async (req, res) => {
    try {
        const imagens = await Imagem.find();
        res.status(200).send(imagens);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post('/parceiros-adicionar', async (req, res) => {
    try {
        const novoParceiro = new Parceiro(req.body);
        await novoParceiro.save();
        res.status(201).send(novoParceiro);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Rota para remover uma imagem
app.delete('/parceiros-remover/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const parceiroRemovido = await Parceiro.findByIdAndDelete(id);
        if (!parceiroRemovido) {
            return res.status(404).send();
        }
        res.status(200).send(parceiroRemovido);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/parceiros-puxar', async (req, res) => {
    try {
        const parceiros = await Parceiro.find();
        res.status(200).send(parceiros);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, () => {
    try {
        conectarAoMongoDB()
        console.log("up and running")
    }
    catch (e) {
        console.log('Erro', e)
    }
})


