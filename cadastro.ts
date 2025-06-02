import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';

// Configurações da API
const BASE_URL = 'http://localhost:3001';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2NiMTI1N2Q1YTM2MDhkYzMwZWYzMCIsIm5hbWUiOiJFbXByZXNhIElhbiIsImVtYWlsIjoiaWFuQG1haWwuY29tIiwiaWF0IjoxNzQ4ODA4ODE3LCJleHAiOjE3NDk0MTM2MTd9.BMqpQ_EKRVA_KJfwGHHmpDEIj18SdeQY7ZdbbID5i0M';

// Headers padrão
const headers = {
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'Content-Type': 'application/json'
};

// Interface para categoria
interface Category {
  name: string;
  icon: string;
}

// Interface para produto
interface Product {
  name: string;
  description: string;
  price: string;
  category: string;
  imagePath?: string;
}

// Definição das categorias
const categories: Category[] = [
  { name: 'Camisas', icon: '👕' },
  { name: 'Ingressos', icon: '🎫' },
  { name: 'Calças', icon: '👖' },
  { name: 'Agasalhos', icon: '🧥' },
  { name: 'Comidas', icon: '🍕' }
];

// Definição dos produtos para cada categoria
const productTemplates = {
  'Camisas': {
    name: 'Camisa Básica São Paulo',
    description: 'Camisa básica de algodão 100%, confortável e versátil',
    price: '29.90',
    imagePath: './images/camisa.jpg'
  },
  'Ingressos': {
    name: 'Ingresso SP x Flamengo',
    description: 'Ingresso para show de rock nacional - Setor Pista',
    price: '85.00',
    imagePath: './images/ingresso.jpg'
  },
  'Calças': {
    name: 'Calça Jeans São Paulo',
    description: 'Calça jeans skinny com elastano, corte moderno',
    price: '79.90',
    imagePath: './images/calca.jpg'
  },
  'Agasalhos': {
    name: 'Moletom Capuz São Paulo',
    description: 'Moletom com capuz, tecido flanelado interno',
    price: '59.90',
    imagePath: './images/agasalho.jpg'
  },
  'Comidas': {
    name: 'Pizza Margherita',
    description: 'Pizza tradicional com molho de tomate, mussarela e manjericão',
    price: '32.50',
    imagePath: './images/pizza.jpg'
  }
};

// Função para criar categoria
async function createCategory(category: Category): Promise<string | null> {
  try {
    console.log(`Criando categoria: ${category.name}`);

    const response = await axios.post(
      `${BASE_URL}/categories`,
      category,
      { headers }
    );

    const categoryId = response.data._id;
    console.log(`✅ Categoria "${category.name}" criada com ID: ${categoryId}`);
    return categoryId;

  } catch (error: any) {
    console.error(`❌ Erro ao criar categoria "${category.name}":`, error.response?.data || error.message);
    return null;
  }
}

// Função para criar produto
async function createProduct(product: Product): Promise<boolean> {
  try {
    console.log(`Criando produto: ${product.name}`);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('category', product.category);

    // Verificar se existe imagem e adicionar ao form data
    if (product.imagePath) {
      if (fs.existsSync(product.imagePath)) {
        formData.append('image', fs.createReadStream(product.imagePath));
        console.log(`  📸 Imagem adicionada: ${product.imagePath}`);
      } else {
        console.log(`  ⚠️  Imagem não encontrada: ${product.imagePath} - produto será criado sem imagem`);
      }
    }

    const response = await axios.post(
      `${BASE_URL}/products`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          ...formData.getHeaders()
        }
      }
    );

    const productId = response.data._id;
    console.log(`✅ Produto "${product.name}" criado com ID: ${productId}`);
    return true;

  } catch (error: any) {
    console.error(`❌ Erro ao criar produto "${product.name}":`, error.response?.data || error.message);
    return false;
  }
}

// Função principal
async function main() {
  console.log('🚀 Iniciando cadastro automático de categorias e produtos...\n');

  const categoryIds: { [key: string]: string } = {};

  // Criar categorias
  console.log('📁 Criando categorias...');
  for (const category of categories) {
    const categoryId = await createCategory(category);
    if (categoryId) {
      categoryIds[category.name] = categoryId;
    }
    // Pequena pausa entre requisições
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📦 Criando produtos...');

  // Criar produtos
  for (const [categoryName, categoryId] of Object.entries(categoryIds)) {
    const productTemplate = productTemplates[categoryName as keyof typeof productTemplates];

    if (productTemplate) {
      const product: Product = {
        ...productTemplate,
        category: categoryId
      };

      await createProduct(product);
      // Pequena pausa entre requisições
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('\n✨ Processo finalizado!');

  // Resumo
  const categoriesCreated = Object.keys(categoryIds).length;
  console.log('\n📊 Resumo:');
  console.log(`   Categorias criadas: ${categoriesCreated}/${categories.length}`);
  console.log(`   Produtos processados: ${categories.length}`);
}

// Função para lidar com erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Erro não tratado:', reason);
  process.exit(1);
});

// Executar script
if (require.main === module) {
  main().catch(console.error);
}

export { createCategory, createProduct };

