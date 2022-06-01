create database dindin;

create table usuarios (
    id serial primary key,
    nome varchar(200) not null, 
    email varchar(250) unique, 
    senha text not null
);

create table categorias (
    id serial primary key,
    descricao text not null
);

create table transacoes (
    id serial primary key,
    tipo text not null,
    descricao text not null,
    valor decimal not null,
    data timestamp not null,
    categoria_id integer references categorias (id),
    usuario_id integer references usuarios (id)
 );

 insert into categorias (descricao) values 
 ('Alimentação'),
 ('Assinaturas e Serviços'),
 ('Casa'),
 ('Mercado'),
 ('Cuidados Pessoais'),
 ('Educação'),
 ('Família'),
 ('Pets'),
 ('Presentes'),
 ('Roupas'),
 ('Transporte'),
 ('Vendas'),
 ('Outras receitas'),
 ('Outras despesas');
 
 insert into usuarios (nome, email, senha)
values
('Jermaine G. Sellers', 'ligula.Nullam@tortordictum.co.uk', 'o2P56U9U'),
('James D. Kennedy', 'amet@Nulladignissim.com', 'q6B78V3V'),
('Amelia S. Harris', 'nec.metus.facilisis@vitaealiquet.edu', 'l4S64Y3A'),
('Joel M. Hartman',  'montes.nascetur@odiotristique.co.uk', 'c4Q27D7O'),
('Elmo K. Greer', 'risus.Duis@eget.ca', 'e3P92I7R');


insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id) values
('entrada', 'entrada de teste do usuário Amelia S. Harris', 3000, now(), 13, 3),
('saida', 'Entrada 01 de Amelia S. Harris', 1500, now(), 14, 3),
('entrada', 'Entrada 02 de Amelia S. Harris', 3000, now(), 12, 3),
('entrada', 'Entrada 03 de Amelia S. Harris', 3000, now(), 12, 3),
('entrada', 'entrada 04', 3000, now(), 13, 1),
('saida', 'Entrada 05', 1500, now(), 14, 2),
('entrada', 'Entrada 06', 3000, now(), 12, 4),
('entrada', 'Entrada 07', 3000, now(), 12, 1),
('entrada', 'Entrada 08', 3000, now(), 13, 1),
('saida', 'Entrada 09', 1500, now(), 14, 2),
('entrada', 'Entrada 10', 3000, now(), 12, 1),
('entrada', 'Entrada 11', 3000, now(), 12, 2);
