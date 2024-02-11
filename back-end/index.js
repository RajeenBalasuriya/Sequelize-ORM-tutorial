const express = require('express');
const app = express();
const { sequelize, User ,Post} = require('./models'); // Use User instead of user
app.use(express.json());

app.post('/users', async (req, res) => {
    const { name, email, role } = req.body;

    try {
        const newUser = await User.create({ name, email, role }); // Use newUser instead of user
        return res.json(newUser);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/users', async (req, res) => {
    try{
        const users=await User.findAll(); 
        return res.json(users)
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/users/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try{
        const users=await User.findOne({
            where: { uuid },
            include: 'posts'
        }); 
        return res.json(users)
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/posts',async(req,res)=>{
    const {userUuid,body}=req.body;
    try{
        const user=await User.findOne({where:{uuid:userUuid}});
        const post=await user.createPost({body});
        return res.json(post);
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/posts',async(req,res)=>{
   try{
       const posts=await Post.findAll({include:'user'});
       return res.json(posts);}
    catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen({port:5000}, async () => {
    console.log('Server up on http://localhost:5000');
    await sequelize.authenticate();
    console.log('Database connected');
});
