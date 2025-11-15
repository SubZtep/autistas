# callm

> Don't run without GPU!

#### Create model

```sh
ollama create callm -f Modelfile
```

#### Run model

```sh
ollama run callm
```

## Data

#### Generate (invalid) samples or messages

```sh
node create_samples.js
node create_messages.js
```

#### Prepare json

```sh
jq -r '.[] | "Q: \(.question)\nA: \(.answer)\n"' /home/dcr/Documents/autistas/models/callm/autism_qa.json
```
