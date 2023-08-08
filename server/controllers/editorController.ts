import { Request, Response } from 'express';

/* load service layer */
import * as editorService from '../services/editorService';

/* manage the handling for request and response to compile user's code. */
export const compileCode = async (req: Request, res: Response) => {
  try {
    const { codeToRun = '', stdin = '' } = req.body;

    // check if required fields are provided
    if (!codeToRun) {
      return res.status(400).send({ status: 400, error: 'codeToRun Required' });
    }

    const response = await editorService.callJDoodleAPI(codeToRun, stdin);
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({
        status: response.statusCode,
        message: response.error,
      });
    }
    return res.status(response.statusCode).send(response);
  } catch (error: any) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

/* fetch boj problem data by its id */
export const getBojProblemById = async (req: Request, res: Response) => {
  try {
    const problemId = req?.params?.problemId;
    if (!problemId) {
      return res.status(400).send({
        status: 400,
        message: 'bad request. problem Id required',
      });
    }
    const { err, result } = await editorService.getBojProblemById(problemId);
    if (result === 0) {
      return res.status(404).send({
        status: 404,
        message: 'problem not found',
      });
    } else if (err) {
      return res.status(500).send({
        status: 500,
        message: 'Error occured while retrieving problem.',
      });
    }
    return res.status(200).send({
      status: 200,
      message: 'sucessfully fetched boj problem',
      data: result,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({
      status: 500,
      message: 'An error occurred while retrieving problem.',
    });
  }
};

/* fetch paginated and filtered boj problems */
export const getFilteredBojProblemByPage = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit, filter } = req.query;
    const { err, result } = await editorService.getFilteredBojProblemByPage(
      //@ts-ignore
      page,
      limit,
      filter
    );

    if (err) {
      return res.status(err.status).send({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(200).send({
      status: 200,
      message: 'sucessfully fetched boj filtered problem',
      data: result,
    });
  } catch (error: any) {
    res
      .status(500)
      .send({ status: 500, message: 'unexpected error while handling filter' });
  }
};

export const origin = (req: Request, res: Response) => {
  res.send({ msg: "I'm alive" });
};
