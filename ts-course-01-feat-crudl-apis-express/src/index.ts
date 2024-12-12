import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello 200Lab!');
});

app.post('/', (req: Request, res: Response) => {
  res.send('Hello with post!');
});

// CRUDL: Create, Read, Update, Delete, List
//        POST, GET, PUT/PATCH, DELETE, GET

app.post('/v1/categories', (req: Request, res: Response) => {
  const { name, image, description, parentId } = req.body as CategoryCreateDTO;

  if (name === '') {
    res.status(400).json({
      message: 'Name is required',
    });

    return;
  }

  const newId = crypto.randomUUID();
  const category: Category = {
    id: newId,
    name: name,
    image: image,
    description: description,
    position: 0,
    parentId: parentId || null,
    status: CategoryStatus.Active,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  categories.push(category);

  res.status(201).json({
    data: newId,
  });
});

app.get('/v1/categories', (req: Request, res: Response) => {
  res.status(200).json({
    data: categories,
  });
});

app.get('/v1/categories/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const category = categories.find((c) => c.id === id);

  if (!category) {
    res.status(404).json({
      message: 'Category not found',
    });

    return;
  }

  res.status(200).json({
    data: category,
  });
});

app.patch('/v1/categories/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const { name, image, description, parentId, status } = req.body as CategoryUpdateDTO;

  const category = categories.find((c) => c.id === id);

  if (!category) {
    res.status(404).json({
      message: 'Category not found',
    });

    return;
  }

  if (name && name !== '') {
    category.name = name;
  }

  if (image) {
    category.image = image;
  }

  if (description) {
    category.description = description;
  }

  if (parentId) {
    category.parentId = parentId;
  }

  if (status) {
    category.status = status;
  }

  category.updatedAt = new Date();

  res.status(200).json({
    data: true,
  });
});

app.delete('/v1/categories/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const category = categories.find((c) => c.id === id);

  if (!category) {
    res.status(404).json({
      message: 'Category not found',
    });

    return;
  }

  // remove category from categories
  categories = categories.filter((c) => c.id !== id);

  res.status(200).json({
    data: true,
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


enum CategoryStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deleted = 'deleted',
}

type CategoryCreateDTO = {
  name: string;
  image?: string;
  description?: string;
  parentId?: string;
};

type CategoryUpdateDTO = {
  name?: string;
  image?: string;
  description?: string;
  parentId?: string;
  status?: CategoryStatus;
};

interface HasId {
  id: string;
}


// Business object/model/entity
type Category = {
  id: string;
  name: string;
  image?: string;
  description?: string;
  position: number;
  parentId: string | null;
  status: CategoryStatus;
  createdAt: Date;
  updatedAt: Date;
};

let categories: Category[] = [
  {
    id: '3e1b1c8e-4f5e-4c3b-8b1e-1c8e4f5e4c3b',
    name: 'Category 1',
    image: 'image1.jpg',
    description: 'Description 1',
    position: 0,
    parentId: null,
    status: CategoryStatus.Active,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3e1b1c8e-4f5e-4c3b-8b1e-1c8e4f5e4c4b',
    name: 'Category 2',
    image: 'image2.jpg',
    description: 'Description 2',
    position: 1,
    parentId: null,
    status: CategoryStatus.Active,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

