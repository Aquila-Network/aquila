import logging

import fastjsonschema

def generate_schema (template):
    # get all keys from template schema
    metadata_templ = template.get("metadata")
    if metadata_templ:
        del template["metadata"]
    else:
        metadata_templ = {}

    keys_ = list(template.keys())

    # sort keys
    keys_.sort()

    # validate required keys
    req_k = ["description", "encoder", "unique"]
    for r_ in req_k:
        if r_ not in keys_:
            # cannot continue, invalid schema
            return None

    # generate schema in sorted keys
    generated_schema = { 
        "$schema": "http://json-schema.org/schema#", 
        "$id": "http://aquilanetwork.com/schema/id/v1", 
        "title": "Schema", 
        "description": "",
        "encoder": "",
        "unique": "",
        "type": "object",
        "properties": {
            "code": {
                "description": "Encoded data",
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "metadata": {
                "$ref": "#/definitions/metadata"
            }
        },
        "definitions": {
            "metadata": {
                "description": "User defined metadata",
                "type": "object",
                "properties": {},
                "required": []
            }
        },
        "required": ["code", "metadata"]
    }

    metadata = {}
    metadata_types = ["number", "string"]

    for key_ in keys_:
        if key_ in req_k:
            # fill in root level keys
            generated_schema[key_] = template[key_]
        elif key_ == "codelen":
            generated_schema["properties"]["code"]["maxItems"] = template[key_]
        else:
            # fill in root level keys :: extra info that we don't care
            generated_schema[key_] = template[key_]

    for key_ in metadata_templ.keys():
        # check type is predefined
        if metadata_templ[key_] not in metadata_types:
            return None

        # fill in metadata keys
        metadata[key_] = {
            "type": metadata_templ[key_]
        }

    generated_schema["definitions"]["metadata"]["properties"] = metadata
    generated_schema["definitions"]["metadata"]["required"] = list(metadata.keys())


    # validate values
    if type(generated_schema["properties"]["code"].get("maxItems")) != int:
        return None
        
    return generated_schema

def compile (schema_def):
    # compile schema
    validator = fastjsonschema.compile(schema_def)

    return validator

def validate_json_docs (validator, json_doc):
    try:
        # validate doc on schema :: will except on fail
        validator(json_doc)
        # validated
        # logging.debug("Schema validation success")
        return True
    except Exception as e:
        logging.error(e)
        return False
