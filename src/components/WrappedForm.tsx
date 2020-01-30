import React, { useState } from "react";
import { Form, Input, Icon, Button, message } from "antd";
import { ValueProps } from "../types/index";
import "../styles/WrappedForm.sass";

const DynamicFieldSet = (props: { form: any }) => {
    const { getFieldDecorator } = props.form;
    const [keys, setKeys] = useState([0]);
    const [id, setId] = useState(1);
    const [Score, setScore] = useState([] as number[]);
    const [Max, setMax] = useState(
        {} as {
            idx: number;
            val: number;
        }
    );

    // methods
    const caculate = (
        WA: number,
        WB: number,
        WC: number,
        WD: number,
        a: number,
        b: number,
        c: number,
        d: number
    ): number => {
        return (a * WA + b * WB + c * WC + d * WD) / 100;
    };
    const remove = (k: number) => {
        if (keys.length === 1) {
            return;
        }
        setKeys(keys.filter((key: number) => key !== k));
        setScore(Score.slice(0,k).concat(Score.slice(k+1)))
    };
    const add = () => {
        setKeys(keys.concat(id));
        setId(id + 1);
    };
    const handleSubmit = (e: Event) => {
        e.preventDefault();
        props.form.validateFields((err: Error, values: ValueProps) => {
            if (!err) {
                const { WA, WB, WC, WD, A, B, C, D } = values;
                if (isNaN(+WA) || isNaN(+WB) || isNaN(+WC) || isNaN(+WD)) {
                    message.warning("检测到非法输入，请输入数字");
                    setMax(
                        {} as {
                            idx: number;
                            val: number;
                        }
                    );
                }
                let arr: number[] = [...Score];
                for (let i = 0; i < A.length; i++) {
                    arr[i] = caculate(WA, WB, WC, WD, A[i], B[i], C[i], D[i]);
                    setScore(arr);
                }
                let max = 0;
                let index = 0;
                arr.forEach((e, idx) => {
                    if (e > max) {
                        max = e;
                        index = idx;
                    }
                });
                setMax({
                    idx: index,
                    val: max
                });
            } else {
                message.error('请检查输入')
            }
        });
    };

    // component
    const formItems = keys.map((k: number, index: number) => (
        <Form.Item
            className="card"
            label={`卡片 ${index + 1}`}
            required={false}
            key={k}
        >
            {/* A */}
            <Form.Item>
                {getFieldDecorator(`A[${k}]`, {
                    validateTrigger: ["onChange", "onBlur"],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "请输入属性A"
                        }
                    ]
                })(
                    <Input
                        placeholder="属性 A"
                        spellCheck="false"
                        autoComplete="off"
                        allowClear
                    />
                )}
            </Form.Item>
            {/* B */}
            <Form.Item>
                {getFieldDecorator(`B[${k}]`, {
                    validateTrigger: ["onChange", "onBlur"],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "请输入属性B"
                        }
                    ]
                })(
                    <Input
                        placeholder="属性 B"
                        spellCheck="false"
                        autoComplete="off"
                        allowClear
                    />
                )}
            </Form.Item>
            {/* C */}
            <Form.Item>
                {getFieldDecorator(`C[${k}]`, {
                    validateTrigger: ["onChange", "onBlur"],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "请输入属性C"
                        }
                    ]
                })(
                    <Input
                        placeholder="属性 C"
                        spellCheck="false"
                        autoComplete="off"
                        allowClear
                    />
                )}
            </Form.Item>
            {/* D */}
            <Form.Item>
                {getFieldDecorator(`D[${k}]`, {
                    validateTrigger: ["onChange", "onBlur"],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "请输入属性D"
                        }
                    ]
                })(
                    <Input
                        placeholder="属性 D"
                        spellCheck="false"
                        autoComplete="off"
                        allowClear
                    />
                )}
            </Form.Item>
            {/* 结果 */}
            <Form.Item
                style={{
                    position: "absolute",
                    transform: 'translateX(460px)'
                }}
            >
                <span
                    style={{
                        color: "rgb(225,225,225)"
                    }}
                >
                    得分：{Score[k] || 0}
                </span>
            </Form.Item>
            {/* 删除卡片按钮 */}
            {keys.length > 1 ? (
                <Icon
                    className="dynamic-delete-button"
                    style={{
                        color: "rgb(225,225,225)",
                        marginBottom: "26px",
                        display: "flex",
                        alignItems: "center"
                    }}
                    type="minus-circle-o"
                    onClick={() => remove(k)}
                />
            ) : null}
        </Form.Item>
    ));

    return (
        <Form>
            {/* 关卡配置 */}
            <Form.Item className="card" label="关卡配置(权重/%)：">
                {/* 权重A */}
                <Form.Item>
                    {getFieldDecorator(`WA`, {
                        validateTrigger: ["onChange", "onBlur"],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "请输入A的权重"
                            }
                        ]
                    })(
                        <Input
                            placeholder="属性 A"
                            spellCheck="false"
                            autoComplete="off"
                            allowClear
                        />
                    )}
                </Form.Item>
                {/* 权重B */}
                <Form.Item>
                    {getFieldDecorator(`WB`, {
                        validateTrigger: ["onChange", "onBlur"],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "请输入B的权重"
                            }
                        ]
                    })(
                        <Input
                            placeholder="属性 B"
                            spellCheck="false"
                            autoComplete="off"
                            allowClear
                        />
                    )}
                </Form.Item>
                {/* 权重C */}
                <Form.Item>
                    {getFieldDecorator(`WC`, {
                        validateTrigger: ["onChange", "onBlur"],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "请输入C的权重"
                            }
                        ]
                    })(
                        <Input
                            placeholder="属性 C"
                            spellCheck="false"
                            autoComplete="off"
                            allowClear
                        />
                    )}
                </Form.Item>
                {/* 权重D */}
                <Form.Item>
                    {getFieldDecorator(`WD`, {
                        validateTrigger: ["onChange", "onBlur"],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "请输入D的权重"
                            }
                        ]
                    })(
                        <Input
                            placeholder="属性 D"
                            spellCheck="false"
                            autoComplete="off"
                            allowClear
                        />
                    )}
                </Form.Item>
            </Form.Item>
            {/* 卡片信息 */}
            {formItems}
            {/* 新增按钮 */}
            <Form.Item>
                <Button type="dashed" onClick={add} style={{ width: "100%" }}>
                    <Icon type="plus" /> <span>新增卡片</span>
                </Button>
            </Form.Item>
            {/* 提交按钮 */}
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={(e: any) => handleSubmit(e)}
                >
                    开始计算
                </Button>
            </Form.Item>
            {Max.val !== undefined && (
                <div className="higher">
                    <p>最佳卡片：{Max.idx + 1}</p>
                    <p>最高分数：{Max.val}</p>
                </div>
            )}
        </Form>
    );
};

const WrappedForm = Form.create({
    name: "best_card_form"
})(DynamicFieldSet);

export default WrappedForm;
